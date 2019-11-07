const globalSpec = require('./index.spec');
const { validEntries, validEntries2, invalidFirstName, invalidLastName, emailExists, missingRequiredField, passwordMismatch } = require("./mockData/signUpMock");


globalSpec('POST /auth/signup', (request, baseUrl) => {
    const endpoint = `${baseUrl}/api/v1/auth/create-user`;
    beforeAll(done => {
        request.post({
            uri: endpoint,
            json: true,
            body: validEntries
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(201);
            expect(body.status).toBe('success');
            expect(body.data.message).toBe('User account successfully created');
            done();
        });
    });

    it('should return a 404 status code when firstName is less than 2 characters', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: invalidFirstName
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.status).toBe('error');
            expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
            done();
        });
    });

    it('should return a 404 status code when lastName is less than 2 characters', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: invalidLastName
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.status).toBe('error');
            expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
            done();
        });
    });

    it('should return a 400 status when at least on field is not sent', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: missingRequiredField
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.status).toBe('error');
            expect(body.error).toBe('Missing required field(s)');
            done();
        });
    });

    it('should return a 400 status when the email already exists', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: emailExists
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.status).toBe('error');
            expect(body.error).toBe('Email already exists');
            done();
        });
    });

    it('should return a 400 status when password and confirmPassword don\'t match', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: passwordMismatch
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.status).toBe('error');
            expect(body.error).toBe('Passwords don\'t match');
            done();
        });
    });

    it('should return a JWT signed token when the user account is successfully created', done => {
        request.post({
            uri: endpoint,
            json: true,
            body: validEntries2
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(201);
            expect(body.status).toBe('success');
            expect(body.data.tokne).not.toBe('undefined');
        });
        done();
    });
});
