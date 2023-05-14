const yup = require("yup");
const validateRegister = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    });
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const validateLogin = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup.string().required("Password is required"),
    });

    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const validateEvent = (mode) => async (req, res, next) => {
  try {
    const validationObj =
      mode === "edit"
        ? {
            title: yup.string(),
            description: yup.string(),
            start: yup.date(),
            end: yup.date(),
            isPublic: yup.boolean(),
            id: yup.string().required("id is required"),
            guests: yup.array().of(yup.string()),
          }
        : {
            title: yup.string().required("Title is required"),
            description: yup.string().required("Description is required"),
            start: yup.date().required("Start date and time are required"),
            end: yup.date().required("End date and time are required"),
            isPublic: yup.boolean().required("Public status is required"),
            guests: yup
              .array()
              .of(yup.string().required("Atleast one userId is required")),
          };
    const schema = yup.object().shape(validationObj);
    await schema.validate(req.body);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEvent,
};
