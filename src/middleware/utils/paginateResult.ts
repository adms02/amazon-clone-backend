import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";

interface Page {
  page: number;
  limit: number;
}

interface Result {
  nextPage?: Page;
  previousPage?: Page;
  limit?: number;
  result?: [];
}

export const paginateResult = (data: any, page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results: Result = {};

  if (endIndex < data.length) {
    results.nextPage = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previousPage = {
      page: page - 1,
      limit: limit,
    };
  }

  results.limit = limit;

  results.result = data.slice(startIndex, endIndex);

  return results;
};
