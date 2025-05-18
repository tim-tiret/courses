import { deleteSessionTokenCookie, invalidateSession } from '$lib/sessions';
import { fail, redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';

const connection = Database('courses.db');

export function load({ locals }) {
	if (!locals.user) {
		redirect(302, '/login');
	}
	console.log(locals.user.id);
	const listedecourse = connection
		.prepare('SELECT * FROM list WHERE user_id = ?')
		.all([locals.user.id]);

	const users = connection.prepare('SELECT apikey FROM user WHERE id = ?').all([locals.user.id]);

	return { courses: listedecourse, apikey: users[0].apikey };
}

export const actions = {
	createitem: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/login');
		}
		console.log('create item');
		const formulaire = await request.formData();
		const nomarticle = formulaire.get('article');
		console.log(nomarticle);
		connection
			.prepare(`INSERT INTO list (article, user_id) VALUES (?, ?)`)
			.run([nomarticle, locals.user.id]);
	},
	deleteitem: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(302, '/login');
		}
		console.log('delete item');
		const formulaire = await request.formData();
		const idarticle = formulaire.get('id');
		console.log(idarticle);
		connection
			.prepare(`DELETE FROM list WHERE id = ? AND user_id = ?`)
			.run([idarticle, locals.user.id]);
	},
	logout: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
