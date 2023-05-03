import { Request, Response, NextFunction } from "express";

const dealPostRequiredFields = [
  {
    name: "company_name",
    type: "string",
  },
  {
    name: "deal_value_estimation",
    type: "number",
  },
  {
    name: "description",
    type: "string",
  },
  {
    name: "name",
    type: "string",
  },
  {
    name: "order",
    type: "number",
  },
];

export const checkRequestBodyIsFormData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.is("multipart/form-data"))
    return res
      .status(401)
      .json({ message: "Request body must be of type multipart/form-data" });
  next();
};

export const checkDataFilePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.is("multipart/form-data"))
    return res
      .status(401)
      .json({ message: "Request body must be of type multipart/form-data" });
  if (!req.file)
    return res
      .status(401)
      .json({ message: "Must include a file inside 'file' field." });
  next();
};

export const checkDealPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = {
    message: "Some fields are missing.",
    missingFields: [],
  };
  if (!req.is("multipart/form-data"))
    return res
      .status(401)
      .json({ message: "Request body must be of type multipart/form-data" });
  if (!req.file) errors.missingFields.push({ name: "logo", type: "file" });

  for (const field of dealPostRequiredFields) {
    if (!req.body[field.name]) {
      errors.missingFields.push({ name: field.name, type: field.type });
    }
  }
  if (errors.missingFields.length !== 0) return res.status(401).json(errors);
  next();
};
