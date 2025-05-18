import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';

const connection = Database('courses.db');

export function GET({ request }) {
	const apikey = request.headers.get('Api-Key');

	if (apikey === null) {
		return json(
			{
				message: 'Unauthorized'
			},
			{ status: 401 }
		);
	}

	const users = connection.prepare('SELECT id FROM user WHERE apikey = ?').all([apikey]);

	if (users.length === 0) {
		return json(
			{
				message: 'Unauthorized'
			},
			{ status: 401 }
		);
	}

	const products = connection
		.prepare('SELECT id, article FROM list WHERE user_id = ?')
		.all([users[0].id]);

	return json({
		message: 'ok',
		products
	});
}

export async function POST({ request }) {
	const apikey = request.headers.get('Api-Key');

	const corps = await request.json();

	const name = corps.name;

	if (apikey === null) {
		return json(
			{
				message: 'Unauthorized'
			},
			{ status: 401 }
		);
	}

	const users = connection.prepare('SELECT id FROM user WHERE apikey = ?').all([apikey]);

	if (users.length === 0) {
		return json(
			{
				message: 'Unauthorized'
			},
			{ status: 401 }
		);
	}

	const result = connection
		.prepare(`INSERT INTO list (article, user_id) VALUES (?, ?)`)
		.run([name, users[0].id]);

	return json({
		message: 'ok',
		product: {
			id: result.lastInsertRowid,
			name
		}
	});
}
