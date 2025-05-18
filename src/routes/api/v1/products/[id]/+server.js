import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';

const connection = Database('courses.db');

export function GET({ request, params }) {
	const apikey = request.headers.get('Api-Key');
	const id = params.id;

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
		.prepare('SELECT id, article FROM list WHERE user_id = ? AND id = ?')
		.all([users[0].id, id]);

	if (products.length === 0) {
		return json(
			{
				message: 'Product does not exists.'
			},
			{
				status: 404
			}
		);
	}

	return json({
		message: 'ok',
		product: products[0]
	});
}

export function DELETE({ request, params }) {
	const apikey = request.headers.get('Api-Key');
	const id = params.id;

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

	connection.prepare('DELETE FROM list WHERE user_id = ? AND id = ?').run([users[0].id, id]);

	return json({
		message: 'product deleted'
	});
}
