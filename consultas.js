// consultas.js
import pg from 'pg';
import format from 'pg-format';
import 'dotenv/config';

const pool = new pg.Pool({
    host: process.env.DB_HOST,// localhost
    user: process.env.DB_USER,// post
    password: process.env.DB_PASSWORD, // "1234"
    database: process.env.DB_DATABASE, // collection
    allowExitOnIdle: true,
})

// obtener joyas
export const obtenerJoyas = async ({ limits = 6, order_by = "id_ASC", page = 1 }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits //solo si queremos que la primera pagina fuera 1 en lugar de 0
    if (page <= 0 || limits <= 0) {
        throw new Error('El valor de page y limits deben ser mayores a 0');
    }
    const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s', campo, direccion === 'DESC' ? 'DESC' : 'ASC', limits, offset);
    const { rows: inventario } = await pool.query(formattedQuery);
    return inventario;
}

export const obtenerJoyasConFiltro = async ({ precio_max, precio_min, categoria, metal }) => {
    let filtros = [];
    let params = [];
    let contador = 1;

    if (precio_max) {
        filtros.push(`precio <= $${contador}`);
        params.push(precio_max);
        contador++;
    }

    if (precio_min) {
        filtros.push(`precio >= $${contador}`);
        params.push(precio_min);
        contador++;
    }

    if (categoria) {
        filtros.push(`categoria = $${contador}`);
        params.push(categoria);
        contador++;
    }

    if (metal) {
        filtros.push(`metal = $${contador}`);
        params.push(metal);
        contador++;
    }
    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(" AND ")}`;
    }

    const { rows: inventario } = await pool.query(consulta, params)
    return inventario;
};
