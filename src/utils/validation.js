// Sistema de validaciones robusto para Predix
import DOMPurify from 'dompurify';

// Expresiones regulares comunes
const REGEX_PATTERNS = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  hashtag: /^#[a-zA-Z0-9_]{1,50}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/
};

// Mensajes de error por defecto
const DEFAULT_MESSAGES = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  password: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  passwordMatch: 'Las contraseñas no coinciden',
  minLength: 'Debe tener al menos {min} caracteres',
  maxLength: 'No puede tener más de {max} caracteres',
  min: 'El valor mínimo es {min}',
  max: 'El valor máximo es {max}',
  phone: 'Ingresa un número de teléfono válido',
  url: 'Ingresa una URL válida',
  hashtag: 'Ingresa un hashtag válido (ej: #ejemplo)',
  username: 'El nombre de usuario debe tener entre 3-20 caracteres alfanuméricos'
};

// Clase principal de validación
export class Validator {
  constructor(locale = 'es') {
    this.locale = locale;
    this.errors = {};
  }

  // Limpiar errores
  clearErrors() {
    this.errors = {};
    return this;
  }

  // Obtener errores
  getErrors() {
    return this.errors;
  }

  // Verificar si hay errores
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  // Validar campo requerido
  required(field, value, message = DEFAULT_MESSAGES.required) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar email
  email(field, value, message = DEFAULT_MESSAGES.email) {
    if (value && !REGEX_PATTERNS.email.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar contraseña fuerte
  password(field, value, message = DEFAULT_MESSAGES.password) {
    if (value && !REGEX_PATTERNS.password.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar que las contraseñas coincidan
  passwordMatch(field, password, confirmPassword, message = DEFAULT_MESSAGES.passwordMatch) {
    if (password && confirmPassword && password !== confirmPassword) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar longitud mínima
  minLength(field, value, min, message = DEFAULT_MESSAGES.minLength) {
    if (value && value.length < min) {
      this.errors[field] = message.replace('{min}', min);
    }
    return this;
  }

  // Validar longitud máxima
  maxLength(field, value, max, message = DEFAULT_MESSAGES.maxLength) {
    if (value && value.length > max) {
      this.errors[field] = message.replace('{max}', max);
    }
    return this;
  }

  // Validar valor mínimo
  min(field, value, min, message = DEFAULT_MESSAGES.min) {
    if (value !== undefined && value !== null && Number(value) < min) {
      this.errors[field] = message.replace('{min}', min);
    }
    return this;
  }

  // Validar valor máximo
  max(field, value, max, message = DEFAULT_MESSAGES.max) {
    if (value !== undefined && value !== null && Number(value) > max) {
      this.errors[field] = message.replace('{max}', max);
    }
    return this;
  }

  // Validar teléfono
  phone(field, value, message = DEFAULT_MESSAGES.phone) {
    if (value && !REGEX_PATTERNS.phone.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar URL
  url(field, value, message = DEFAULT_MESSAGES.url) {
    if (value && !REGEX_PATTERNS.url.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar hashtag
  hashtag(field, value, message = DEFAULT_MESSAGES.hashtag) {
    if (value && !REGEX_PATTERNS.hashtag.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validar nombre de usuario
  username(field, value, message = DEFAULT_MESSAGES.username) {
    if (value && !REGEX_PATTERNS.username.test(value)) {
      this.errors[field] = message;
    }
    return this;
  }

  // Validación personalizada
  custom(field, value, validatorFn, message) {
    if (!validatorFn(value)) {
      this.errors[field] = message;
    }
    return this;
  }
}

// Funciones de utilidad para sanitización
export const sanitize = {
  // Limpiar HTML para prevenir XSS
  html: (input) => {
    if (typeof input !== 'string') return input;
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  },

  // Limpiar input básico
  text: (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  },

  // Limpiar email
  email: (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().toLowerCase();
  },

  // Limpiar hashtag
  hashtag: (input) => {
    if (typeof input !== 'string') return input;
    let cleaned = input.trim();
    if (!cleaned.startsWith('#')) {
      cleaned = '#' + cleaned;
    }
    return cleaned.replace(/[^#a-zA-Z0-9_]/g, '');
  },

  // Limpiar número de teléfono
  phone: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[^\d\+]/g, '');
  }
};

// Esquemas de validación predefinidos
export const validationSchemas = {
  // Esquema de registro
  register: (data) => {
    const validator = new Validator();
    
    return validator
      .required('name', data.name)
      .minLength('name', data.name, 2)
      .maxLength('name', data.name, 50)
      .required('email', data.email)
      .email('email', data.email)
      .required('password', data.password)
      .password('password', data.password)
      .required('confirmPassword', data.confirmPassword)
      .passwordMatch('confirmPassword', data.password, data.confirmPassword);
  },

  // Esquema de login
  login: (data) => {
    const validator = new Validator();
    
    return validator
      .required('email', data.email)
      .email('email', data.email)
      .required('password', data.password)
      .minLength('password', data.password, 6);
  },

  // Esquema de perfil
  profile: (data) => {
    const validator = new Validator();
    
    return validator
      .required('name', data.name)
      .minLength('name', data.name, 2)
      .maxLength('name', data.name, 50)
      .email('email', data.email)
      .maxLength('bio', data.bio, 500);
  },

  // Esquema de hashtag
  hashtag: (data) => {
    const validator = new Validator();
    
    return validator
      .required('hashtag', data.hashtag)
      .hashtag('hashtag', data.hashtag);
  }
};

// Hook para usar validaciones en React
export const useValidation = (schema) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((data) => {
    const validator = schema(data);
    const validationErrors = validator.getErrors();
    
    setErrors(validationErrors);
    setIsValid(!validator.hasErrors());
    
    return !validator.hasErrors();
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    setIsValid(false);
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    setIsValid(Object.keys(errors).length <= 1);
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    setFieldError,
    clearFieldError
  };
};

export default Validator;
