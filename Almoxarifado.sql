CREATE DATABASE almoxarifado;

USE almoxarifado;

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    responsavel VARCHAR(100),
    nome VARCHAR(255),
    categoria VARCHAR (100),
    qtde INT,
    estoque_min INT,
    preco DECIMAL (10,2),
	descricao VARCHAR (500),
    imagem VARCHAR(255)
);

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario'
);

INSERT INTO estoque (responsavel, nome, categoria, qtde, estoque_min, preco, descricao, imagem)
VALUES ("Róger", "Chave Fenda", "Ferramenta", 12, 24, 25.00, "Chave de fenda pequena", "/static/chave_fenda.jpg");
INSERT INTO estoque (responsavel, nome, categoria, qtde, estoque_min, preco, descricao, imagem)
VALUES ("Viviane", "Alicate", "Ferramenta", 8, 28, 28.00, "Alicate da marca Tramontina", "/static/alicate.jpg");

INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('Administrador', 'admin@empresa.com', '123456', 'admin');
INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('João', 'joao@empresa.com', '123456', 'usuário');	

SELECT * FROM estoque;
SELECT * FROM usuarios;

DROP TABLE estoque;
TRUNCATE TABLE estoque;
TRUNCATE TABLE usuarios;