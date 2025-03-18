import Database from 'better-sqlite3';

const connection = Database('courses.db');

export function load() {
	const listedecourse = connection.prepare('SELECT * FROM list').all();
	return { courses: listedecourse };
}

export const actions = {
	createitem: async ({ request }) => {
		console.log('create item');
		const formulaire = await request.formData();
		const nomarticle = formulaire.get('article');
		console.log(nomarticle);
		connection.prepare(`INSERT INTO list (article) VALUES (?)`).run(nomarticle);
	},
	deleteitem: async ({ request }) => {
		console.log('delete item');
		const formulaire = await request.formData();
		const idarticle = formulaire.get('id');
		console.log(idarticle);
		connection.prepare(`DELETE FROM list WHERE id = ?`).run(idarticle);
	}
};
