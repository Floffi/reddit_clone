import validator from 'validator';

const isString = (data) => typeof data === 'string' && data.length > 0;

const isObject = (data) => typeof data === 'object' && data !== null;

export const formValidation = {
  register: (data) => {
    const errors = {};
    // Contains all must have input fields.
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    // Check whether input field values exists.
    fields.forEach((field) => {
      data[field] = isString(data[field]) ? data[field] : '';
    });
    if (!validator.isLength(data.name, { min: 2, max: 20 })) {
      errors.name = 'Name must be between 2 and 20 characters';
    }
    if (validator.isEmpty(data.name)) {
      errors.name = 'Name is required';
    }
    if (!validator.isEmail(data.email)) {
      errors.email = 'E-mail is invalid';
    }
    if (validator.isEmpty(data.email)) {
      errors.email = 'E-mail is required';
    }
    if (!validator.isLength(data.password, { min: 6, max: 32 })) {
      errors.password = 'Password must be between 6 and 32 characters';
    }
    if (validator.isEmpty(data.password)) {
      errors.password = 'Password is required';
    }
    if (!validator.equals(data.password, data.confirmPassword)) {
      errors.confirmPassword = 'Passwords must match';
    }
    if (validator.isEmpty(data.confirmPassword)) {
      errors.confirmPassword = 'Confirm Password is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  login: (data) => {
    const errors = {};
    // Contains all must have input fields.
    const fields = ['name', 'password'];
    // Check whether input field values exists.
    fields.forEach((field) => {
      data[field] = isString(data[field]) ? data[field] : '';
    });
    if (validator.isEmpty(data.name)) {
      errors.name = 'Name is required';
    }
    if (validator.isEmpty(data.password)) {
      errors.password = 'Password is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  community: (data) => {
    const errors = {};
    // Contains all must have input fields.
    const fields = ['name'];
    // Check whether input field values exists.
    fields.forEach((field) => {
      data[field] = isString(data[field]) ? data[field] : '';
    });
    if (!validator.isLength(data.name, { min: 2, max: 20 })) {
      errors.name = 'Name must be between 2 and 20 characters';
    }
    if (validator.isEmpty(data.name)) {
      errors.name = 'Name is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  post: (data) => {
    const errors = {};
    if (
      !isObject(data.selectedOption) ||
      !data.selectedOption.hasOwnProperty('value') ||
      !data.selectedOption.hasOwnProperty('label')
    ) {
      errors.selectedOption = 'Community is required';
    }
    if (!validator.isLength(data.title, { min: 2, max: 300 })) {
      errors.title = 'Title must have between 2 and 300 characters';
    }
    if (validator.isEmpty(data.title)) {
      errors.title = 'Title is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  comment: (data) => {
    const errors = {};
    data.text = isString(data.text) ? data.text : '';
    if (validator.isEmpty(data.text)) {
      errors.text = 'Text is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export const inputValidation = {
  register: (field, data) => {
    let error;
    if (field === 'name') {
      if (!validator.isLength(data, { min: 2, max: 20 })) {
        error = 'Name must be between 2 and 20 characters';
      }
      if (validator.isEmpty(data)) {
        error = 'Name is required';
      }
    }
    if (field === 'email') {
      if (!validator.isEmail(data)) {
        error = 'E-mail is invalid';
      }
      if (validator.isEmpty(data)) {
        error = 'E-mail is required';
      }
    }
    if (field === 'password') {
      if (!validator.isLength(data, { min: 6, max: 32 })) {
        error = 'Password must be between 6 and 32 characters';
      }
      if (validator.isEmpty(data)) {
        error = 'Password is required';
      }
    }
    if (field === 'confirmPassword') {
      if (!validator.equals(data.password, data.confirmPassword)) {
        error = 'Passwords must match';
      }
      if (validator.isEmpty(data.confirmPassword)) {
        error = 'Confirm Password is required';
      }
    }
    return {
      isValid: !error,
      error,
    };
  },
  login: (field, data) => {
    let error;
    if (field === 'name') {
      if (validator.isEmpty(data)) {
        error = 'Name is required';
      }
    }
    if (field === 'password') {
      if (!validator.isLength(data, { min: 6, max: 32 })) {
        error = 'Password must be between 6 and 32 characters';
      }
      if (validator.isEmpty(data)) {
        error = 'Password is required';
      }
    }
    return {
      isValid: !error,
      error,
    };
  },
  community: (field, data) => {
    let error;
    if (field === 'name') {
      if (!validator.isLength(data, { min: 2, max: 20 })) {
        error = 'Name must be between 2 and 20 characters';
      }
      if (validator.isEmpty(data)) {
        error = 'Name is required';
      }
    }
    return {
      isValid: !error,
      error,
    };
  },
};
