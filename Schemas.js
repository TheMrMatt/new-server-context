const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }

        }  
    }
});

const Joi = BaseJoi.extend(extension) 

module.exports.notaSchema = Joi.object({
    nota: Joi.object({
        titulo: Joi.string().required().escapeHTML(),
        categoria: Joi.string().required().min(0),
        subCategoria: Joi.string(),
        descripcion: Joi.string().required().escapeHTML(),
        contenido: Joi.string().required()
    })
});

module.exports.ReviewSchema = Joi.object({
    review: Joi.object().keys({
        body: Joi.string().required().escapeHTML().messages({
            'string.base': `"a" should be a type of 'text'`,
            'string.empty': `"a" cannot be an empty field`,
            'string.min': `"a" should have a minimum length of {#limit}`,
            'any.required': `"a" is a required field`
          }),
        rating: Joi.number().required().min(1).max(5)
        
    })
})