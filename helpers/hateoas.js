// helpers/hateoas.js

export default function generarEnlacesJoyas(joyas) {
    const baseUrl = 'http://localhost:3000/joyas';
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `${baseUrl}/${j.id}`
        }
    });
    const total = joyas.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

