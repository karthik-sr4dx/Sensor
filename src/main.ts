import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Sensor API')
    .setDescription('API documentation for sensor data')
    .setVersion('1.0')
    .addTag('sensors') // Tag for your Sensor APIs
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Serve Swagger UI at /api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000, () => {
    console.log('Application is running on: http://localhost:3000');
    console.log('Swagger UI available at: http://localhost:3000/api-docs');
  });
}

bootstrap();
