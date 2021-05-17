import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  // http://url/nomedafunction/id
  const { id } = event.pathParameters;

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

  const userCertificate = response.Items[0];

  if (userCertificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificado válido",
        name: userCertificate.name,
        url: `https://serverlesscertificatesignite.s3.amazonaws.com/${id}.pdf`,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificado inválido!",
    }),
  };
};
