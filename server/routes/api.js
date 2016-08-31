'use strict';

let models = require('../models');
let fs = require('fs-extra');

// File Upload Route Configs
let files = {
    create: function(request, reply) {
        let data = request.payload;
		console.log(data);
        if (data.file) {
            let name = Date.now() + '-' + data.file.hapi.filename;
            let path = '/usr/share/nginx/html/demo/dist/uploads/' + request.params.path + '/' + name;
			console.log(path);
            let file = fs.createWriteStream(path);

            file.on('error', function(err) {
                console.error(err);
            });

            data.file.pipe(file);

            data.file.on('end', function(err) {
                let response = {
                    filename: name,
                    headers: data.file.hapi.headers,
                    status: 200,
                    statusText: 'File uploaded successfully!'
                };
                reply(JSON.stringify(response));
            });
        }
        else {
            let response = {
                filename: data.file.hapi.filename,
                headers: data.file.hapi.headers,
                status: 400,
                statusText: 'There was an error uploading your file. Max sure the dimensions are 800px by 530px.'
            };
            reply(JSON.stringify(response));
        }
    }
};

// Director Route Configs
let directors = {
    get: function(req, res) {
        models.Director.find({
                where: {
                    id: req.params.id
                },
				include: [models.Movie]
            })
            .then(function(director) {
				if (director) {
					res(director).code(200);
				}
				else {
					res().code(404);
				}
            });
    },
    getAll: function(req, res) {
        models.Director.findAll({
			limit: 50,
			order: '"updatedAt" DESC'
		})
            .then(function(directors) {
                res(directors).code(200);
            });
    },
    create: function(req, res) {
        models.Director.create({
                firstName: req.payload.firstName,
                lastName: req.payload.lastName,
                bio: req.payload.bio
            })
            .then(function(director) {
                res(director).code(200);
            });
    },
    update: function(req, res) {
        models.Director.find({
                where: {
                    id: req.params.id
                }
            })
            .then(function(director) {
                if (director) {
                    director.updateAttributes({
                        firstName: req.payload.firstName,
                        lastName: req.payload.lastName,
                        bio: req.payload.bio
                    }).then(function(director) {
                        res(director).code(200);
                    });
                }
                else {
                    res().code(404);
                }
            });
    },
    delete: function(req, res) {
        models.Director.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(function(director) {
                if (director) {
                    res().code(200);
                }
                else {
                    res().code(404);
                }
            });
    }
};


// Movie Route Configs
let movies = {
    get: function(req, res) {
        models.Movie.find({
                where: {
                    id: req.params.id
                },
				include: [models.Director]
            })
            .then(function(movie) {
                if (movie) {
                    res(movie).code(200);
                }
                else {
                    res().code(404);
                }
            });
    },
    getAll: function(req, res) {
        models.Movie.findAll({
			limit: 50,
			order: '"updatedAt" DESC'
		})
            .then(function(movies) {
                res(movies).code(200);
            });
    },
    create: function(req, res) {
        models.Movie.create({
                title: req.payload.title,
                year: req.payload.year,
                director: req.payload.director,
                DirectorId: req.payload.DirectorId,
                genre: req.payload.genre,
                coverImg: req.payload.coverImg,
                description: req.payload.description,
                synopsis: req.payload.synopsis,
                rating: req.payload.rating
            })
            .then(function(movie) {
                res(movie).code(200);
            })
            .catch(function() {
                res().code(406);
            });
    },
    update: function(req, res) {
        models.Movie.find({
                where: {
                    id: req.params.id
                }
            })
            .then(function(movie) {
                if (movie) {
                    movie.updateAttributes({
                        title: req.payload.title,
                        year: req.payload.year,
                        DirectorId: req.payload.DirectorId,
                        genre: req.payload.genre,
                        coverImg: req.payload.coverImg,
                        synopsis: req.payload.synopsis,
                        description: req.payload.description,
                        rating: req.payload.rating
                    }).then(function(movie) {
                        res(movie).code(200);
                    }).catch(function() {
                        res().code(406);
                    });
                }
                else {
                    res().code(404);
                }
            });
    },
    delete: function(req, res) {
        models.Movie.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(function(movie) {
                if (movie) {
                    res().code(200);
                }
                else {
                    res().code(404);
                }
            });
    }
};


module.exports = {
    directors,
    movies,
	files
};
