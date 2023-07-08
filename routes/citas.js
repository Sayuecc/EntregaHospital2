var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

router.get('/', function (req, res, next) {
    connection.query('SELECT cm.id, cm.fecha, cm.id_paciente, cm.id_medico, med.cedula, med.especialidad FROM cita_medica cm, medicos med WHERE cm.id_medico = med.cedula ORDER BY fecha', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('citas', { title: 'CENTRO MÉDICO', citas: results, opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT cm.id, cm.fecha, cm.id_paciente, cm.id_medico, med.cedula, med.especialidad FROM cita_medica cm, medicos med WHERE cm.id_medico = med.cedula ORDER BY fecha', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('citas', { title: 'CENTRO MÉDICO', claveSeleccionada: clave, citas: results, opcion: 'disabled', estado: false })
        }
    });
});

router.get('/agregar-cita', function (req, res, next) {
    connection.query('SELECT cedula_paciente FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query('SELECT especialidad FROM medicos', (error, results2) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.render('registro-citas', { title: 'CENTRO MÉDICO', layout: 'registro', pacientes: results, medicos: results2 })
                }
            });  
        }
    });
});


router.post('/agregar', function (req, res, next){
    const cedulaPaciente = req.body.cedula;
    const fecha = req.body.fecha;
    const especialidad = req.body.especialidad;
    connection.query(`SELECT cedula FROM medicos WHERE especialidad='${especialidad}'`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let cedulaMedico = results[0].cedula
            connection.query(`INSERT INTO cita_medica (id_paciente, id_medico, fecha) VALUES (${cedulaPaciente}, ${cedulaMedico},'${fecha}');`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/citas')
                }
            });
        }
    });
});
//eliminar cita
router.get('/eliminar/:id', function (req, res, next) {
    const id = req.params.id
    connection.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/citas')     
        }
    });
});
router.post('/actualizar/:cedula', (req, res) => {//me trae cc paciente cc doctor pero no especialidad
    const cedula = req.params.cedula;
    const fecha = req.body.fecha;
    connection.query(`UPDATE cita_medica SET fecha='${fecha}' WHERE id=${cedula}`, (error, result) => {
                if (error) {
                    console.log("Ocurrio un error en la ejecución", error)
                    res.status(500).send("Error en la consulta");
                } else {
                    res.redirect('/citas');
                }
    });
        
})

module.exports = router;