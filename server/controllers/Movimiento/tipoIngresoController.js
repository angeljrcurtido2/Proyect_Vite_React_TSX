import TipoIngreso from "../../models/Movimiento/TipoIngreso.js";

export const crearTipoIngreso = (req, res) => {
    const { descripcion } = req.body;
    if (!descripcion) return res.status(400).json({ error: '⚠️ Descripción requerida' });

    TipoIngreso.create({ descripcion }, (err, result) => {
        if (err) return res.status(500).json({ error: '❌ Error al crear tipo de ingreso' });
        res.status(201).json({ message: '✅ Tipo de ingreso creado correctamente' });
    });
};

export const listarTiposIngresoPag = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    TipoIngreso.countFiltered(search, (errCount, total) => {
        if (errCount) return res.status(500).json({ error: errCount });

        TipoIngreso.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
            if (err) return res.status(500).json({ error: err });

            const totalPages = Math.ceil(total / limit);
            res.json({
                data,
                totalItems: total,
                totalPages,
                currentPage: page
            });
        });
    });
};

export const anularTipoIngreso = (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: '⚠️ ID requerido' });

    TipoIngreso.softDelete(id, (err) => {
        if (err) return res.status(500).json({ error: '❌ Error al anular tipo de ingreso' });
        res.json({ message: '✅ Tipo de ingreso anulado correctamente' });
    });
};
