import { db } from '$lib/db';
import { createSession, generateSessionToken, google, setSessionTokenCookie } from '$lib/sessions';
import { decodeIdToken } from 'arctic';

export async function GET(event) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const username = claims.name;
	const email = claims.email;

	// TODO: Replace this with your own DB query.
	const existingUser = db.prepare('SELECT * FROM user WHERE google_id = ?').all([googleUserId]);

	if (existingUser.length !== 0) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser[0].id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = db
		.prepare('INSERT INTO user (google_id, email, username) VALUES (?,?,?)')
		.run([googleUserId, email, username]);

	console.log(user);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.lastInsertRowid);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
