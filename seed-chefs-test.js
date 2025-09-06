const db = require('./src/config/db'); // ajuste o caminho conforme sua estrutura
const { date } = require('./src/lib/utils'); // se você tiver uma função de data

async function insertFile(path) {
  const query = `
    INSERT INTO files (name, path)
    VALUES ($1, $2)
    RETURNING id
  `;
  const values = [
    'dummy.jpg',
    path
  ];
  const result = await db.query(query, values);
  return result.rows[0].id;
}

async function insertChef(name, file_id) {
  const query = `
    INSERT INTO chefs (name, file_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const values = [
    name,
    file_id,
    date(Date.now()).iso,
    date(Date.now()).iso
  ];

  const result = await db.query(query, values);
  return result.rows[0]; // retorna { id: ... }
}

async function run() {
  try {
    const fileIds = await Promise.all([
      insertFile('public/images/1.jpg'),
      insertFile('public/images/2.jpg'),
      insertFile('public/images/3.jpg')
    ]);

    const chefPromise = [
      insertChef('Rodrigo', fileIds[0]),
      insertChef('Joana', fileIds[1]),
      insertChef('Carlos', fileIds[2])
    ];

    const chefsIds = await Promise.all(chefPromise);
    console.log('CHEFS INSERIDOS:');
    chefsIds.forEach((chef, i) => {
      console.log(`Chef ${i + 1}:`, chef);
    });

    db.end();
  } catch (err) {
    console.error('Erro durante execução:', err);
  }
}


run().catch(console.error);