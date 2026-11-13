const ok      = (res, data, msg = 'Operación exitosa', status = 200) =>   
    res.status(status).json({ success: true, message: msg, data });  

const created = (res, data, msg = 'Recurso creado exitosamente') =>   
    res.status(201).json({ success: true, message: msg, data }); 

const badRequest = (res, msg = 'Datos inválidos') =>   
    res.status(400).json({ success: false, message: msg });  

const unauthorized = (res, msg = 'No autorizado') =>   
    res.status(401).json({ success: false, message: msg });  

const notFound = (res, msg = 'Recurso no encontrado') =>   
    res.status(404).json({ success: false, message: msg });  

const conflict = (res, msg = 'Conflicto con un recurso existente') =>   
    res.status(409).json({ success: false, message: msg });  

const serverError = (res, msg = 'Error interno del servidor') =>   
    res.status(500).json({ success: false, message: msg });  

module.exports = { ok, created, badRequest, unauthorized, notFound, conflict, serverError };