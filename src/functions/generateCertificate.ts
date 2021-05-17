// Para podermos utilizar o puppeteer
import chromium from "chrome-aws-lambda";
import path from "path";
import handlebars from "handlebars";
import fs from "fs";
import dayjs from "dayjs";
import { S3 } from "aws-sdk";

import { document } from "../utils/dynamodbClient";

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

interface ITemplate {
  id: string;
  name: string;
  grade: string;
  date: string;
  medal: string;
}

/**
 * @function Para compilar o HTML
 * @param data 
 * @returns ITemplate
 */
const compile = async function (data: ITemplate) {
  const filePath = path.join(
    // process.cwd() -> diretório da aplicação "root"
    process.cwd(),
    "src",
    "templates",
    "certificate.hbs"
  );

  // Lê o arquivo
  const html = fs.readFileSync(filePath, "utf-8");

  /**
   * handlebars -> Para compilar um HTML e transformar as variáveis em dados dinâmicos
   *               Caso fosse um HTML estático, não precisaria     
   */
  return handlebars.compile(html)(data);
};

export const handle = async (event) => {
  // id, name, grade =
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;

  // Queremos procurar um certificado pelo ID
  const response = await document
    .query({
      // Qual a tabela?
      TableName: "users_certificates",
      // Qual atributo(id)? Qual parâmetro que quero settar(:id)? 
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const userAlreadyExists = response.Items[0];

  // Se o usuário não existir ainda
  if (!userAlreadyExists) {
    // Utilizando o document para inserir um elemento na tabela  
    await document
      .put({
        // Tabela
        TableName: "users_certificates",
        // Colunas
        Item: {
          id,
          name,
          grade,
        },
      })
      .promise();
  }

  // Medal será a imagem da medalha
  const medalPath = path.join(process.cwd(), "src", "templates", "selo.png");
  // Faz a leitura e transforma em base64 para conseguir ver a imagem na tela
  const medal = fs.readFileSync(medalPath, "base64");

  const data: ITemplate = {
    date: dayjs().format("DD/MM/YYYY"),
    grade,
    name,
    id,
    medal,
  };

  // Gera o certificado
  // Compilar usando handlebars
  const content = await compile(data);

  // Transformar em PDF
  /**
   * "chromium" -> é para transformar em PDF e poder visualizar no browser
   * "chromium.puppeteer" -> permite que executemos um browser (chrome) por debaixo dos panos
   *                         podemos também passar um conteúdo e passar esse conteúdo para PDF
   */
  // -- Criando um browser
  const browser = await chromium.puppeteer.launch({
    headless: true,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath, //caminho do browser que vai executar
  });

  // -- Cria uma nova página no browser
  const page = await browser.newPage();

  // -- Setta conteúdo da página
  await page.setContent(content);

  // -- Cria novo PDF na página
  const pdf = await page.pdf({
    format: "a4",
    landscape: true,
    path: process.env.IS_OFFLINE ? "certificate.pdf" : null, //Se for ambiente local, queremos gerar o certificado na raiz do projeto
    printBackground: true,
    preferCSSPageSize: true,
  });

  // -- Fecha browser
  await browser.close();

  // Salvar no S3

  // -- Instanciando o S3
  const s3 = new S3();

  await s3
    .putObject({
      Bucket: "serverlesscertificatesignite",
      Key: `${id}.pdf`, // Nome/ID do PDF
      ACL: "public-read", // Permissão
      Body: pdf,
      ContentType: "application/pdf", // Obrigatório para ser salvo mesmo como PDF
    })
    .promise();

  return {
    statusCode: 201, //Sucesso!
    body: JSON.stringify({
      message: "Certificate created!",
      // URL do certificado
      url: `https://serverlesscertificatesignite.s3.amazonaws.com/${id}.pdf`,
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
