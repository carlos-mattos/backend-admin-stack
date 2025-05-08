import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Backend Admin')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Caminho para a raiz do projeto (sobe um nível a partir de dist/)
  const projectRoot = resolve(__dirname, '..');
  const outputPath = resolve(projectRoot, 'swagger-spec.json');

  // Grava o arquivo na raiz
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`Swagger spec escrita em: ${outputPath}`);

  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
