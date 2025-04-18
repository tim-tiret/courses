import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from './db';
import { sha256 } from '@oslojs/crypto/sha2';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

export function generateSessionToken() {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function createSession(token, userId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	db.prepare('INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)').run([
		session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000)
	]);
	return session;
}

export function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const currentsession = db
		.prepare(
			'SELECT session.id, session.user_id, session.expires_at, user.id AS userid FROM session INNER JOIN user ON user.id = session.user_id WHERE session.id = ?'
		)
		.all([sessionId]);
	if (currentsession.length === 0) {
		return { session: null, user: null };
	}

	const session = {
		id: currentsession[0].id,
		userId: currentsession[0].userid,
		expiresAt: new Date(currentsession[0].expires_at * 1000)
	};
	const user = {
		id: currentsession[0].userid
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		db.execute('DELETE FROM session WHERE id = ?', session.id);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		db.execute(
			'UPDATE session SET expires_at = ? WHERE id = ?',
			Math.floor(session.expiresAt.getTime() / 1000),
			session.id
		);
	}
	return { session, user };
}

export function invalidateSession(sessionId) {
	db.prepare('DELETE FROM session WHERE id = ?').run(sessionId);
}

export async function invalidateAllSessions(userId) {
	await db.prepare('DELETE FROM user_session WHERE user_id = ?').run(userId);
}

export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5173/login/google/callback'
);
