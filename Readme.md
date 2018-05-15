A simple full-stack stock/portfolio tracking app.

Purpose is, in part, to practice working with MongoDB _without_ Mongoose - just Node's native MongoDB driver.

Routes

| Verb   | Endpoint                                 | Description            |
|--------|------------------------------------------|------------------------|
| POST   | /auth/register                           | Register new user      |
| POST   | /auth/login                              | User login             |
| POST   | /api/portfolios                          | Create a new portfolio |
| GET    | /api/portfolios                          | Get all portfolios     |
| GET    | /api/portfolios/:id                      | Get one portfolio      |
| PUT    | /api/portfolios/:id                      | Update a portfolio     |
| DELETE | /api/portfolios/:id                      | Delete a portfolio     |
| POST   | /api/portfolios/:id/holdings             | Add a holding          |
| PUT    | /api/portfolios/:pfloId/holdings/:hldgId | Update a holding       |
| DELETE | /api/portfolios/:pfloId/holdings/:hldgId | Delete a holding       |
| GET    | /api/users/:id                           | Get a user             |
| DELETE | /api/users/:id                           | Delete a user          |