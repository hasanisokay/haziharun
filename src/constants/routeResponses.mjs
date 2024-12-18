import { NextResponse } from "next/server";

export const serverErrorResponse = (message = "Internal Server Error") => {
  return NextResponse.json({ error: message, status: 500 });
};

export const successResponse = (data = {}, message = "Request successful") => {

  return NextResponse.json({ message, data, status: 200 },);
};

export const badRequestResponse = (message = "Bad Request") => {
  return NextResponse.json({ error: message }, { status: 400 });
};

export const unauthorizedResponse = (message = "Unauthorized") => {
  return NextResponse.json({ error: message }, { status: 401 });
};

export const forbiddenResponse = (message = "Forbidden") => {
  return NextResponse.json({ error: message }, { status: 403 });
};

export const notFoundResponse = (message = "Not Found") => {
  return NextResponse.json({ error: message }, { status: 404 });
};

export const conflictResponse = (message = "Conflict") => {
  return NextResponse.json({ error: message }, { status: 409 });
};

export const serviceUnavailableResponse = (message = "Service Unavailable") => {
  return NextResponse.json({ error: message }, { status: 503 });
};

export const createdResponse = (data = {}, message = "Resource created") => {
  return NextResponse.json({ message, data }, { status: 201 });
};

export const invalidCredentialsResponse = (
  message = "Wrong username or password.",
  error = "Invalid Credentials"
) => {
  return NextResponse.json({
    status: 401,
    error: error,
    message: message,
  });
};
