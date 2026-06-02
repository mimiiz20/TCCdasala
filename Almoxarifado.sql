CREATE DATABASE almoxarifado;

USE almoxarifado;

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    qtde INT,
    imagem VARCHAR(255)
);
        
SELECT * FROM estoque;

INSERT INTO estoque (nome, qtde, imagem)
VALUES ("Chave Fenda", 12, "/static/chave_fenda.jpg");
INSERT INTO estoque (nome, qtde, imagem)
VALUES ("Alicate", 8, "/static/alicate.jpg");

TRUNCATE TABLE estoque;

