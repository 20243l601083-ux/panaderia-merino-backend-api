const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi    = require('swagger-ui-express');  
const options = {   
    definition: {     
        openapi: '3.0.0',     
        info: {      
            title:       'API REST — Backend con Node.js y PostgreSQL',       
            version:     '1.0.0',       
            description:  'Documentación del backend del sistema Panadería Merino desarrollado con Node.js, Express y PostgreSQL.',
            contact: { name: 'Soporte', email: 'soporte@ejemplo.com' }    
        },     
        
    // Servidores donde se encuentra la API
   servers: [
        {
        url: 'https://panaderia-merino-1.onrender.com/api',
        description: 'Servidor de producción — Render'
        }
   ],

    //Authenticación con JWT
    components: {       
        securitySchemes: {         
            BearerAuth: {           
                type:         'http',           
                scheme:       'bearer',          
                bearerFormat: 'JWT',           
                description:  'Ingresa el token JWT obtenido del endpoint /login'         
                }     
            }, 
       
        //Esquemas     
        schemas: {         
            Usuario: {           
                type: 'object',           
                properties: {
                    id_usuario:          { type: 'integer', example: 1 },             
                    nombre:              { type: 'string',  example: 'Administrador Merino' },                       
                    email:               { type: 'string',example:'admin@merino.com' },
                    rol:                 { type: 'string',example:'admin'},   
                    estado:              { type: 'boolean',example:true },            
                    ultimo_acceso:       { type: 'string',format:'date-time'},          
                    fecha_creacion:      { type: 'string',format:'date-time' }          
                }  

            },  
            
            Cliente: {
               type: 'object',
               properties: {
                    id_cliente:         { type: 'integer', example: 2 },
                    id_usuario:         { type: 'integer', example: 6  },
                    telefono:           { type: 'string', example: '2711234567' },
                    direccion:          { type: 'string', example: 'Córdoba Veracruz' },
                    usuario:            { $ref: '#/components/schemas/Usuario' }
                }
            },

            RegistroInput: {           
                type:     'object',           
                required: ['nombre','email','password'],          
                properties: {             
                    nombre:   { type: 'string', example: 'Administrador Merino'},            
                    email:    { type: 'string', example: 'admin@merino.local' },             
                    password: { type: 'string', example: 'Admin123' },  
                    rol:      { type: 'string', example:'admin' }        
                }         
            },   
                  
            LoginInput: {           
                type:     'object',           
                required: ['email','password'],           
                properties: {            
                    email:    { type: 'string', example: 'admin@merino.local' },             
                    password: { type: 'string', example: 'Admin123' }           
                }         
            }      
        }     
    }   
},   

// Rutas donde buscar los comentarios JSDoc   
apis: ['./routes/*.js'] 
};

const swaggerSpec = swaggerJsdoc(options); 
module.exports    = { swaggerUi, swaggerSpec }; 