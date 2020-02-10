# Instalación

## Requerimientos del servidor

Ver [SERVER.md](SERVER.md)

## Instalación del proyecto

1. Clonar el código fuente desde el repositorio.

```sh
$ git clone https://gitlab.agetic.gob.bo/agetic/base-backend.git
```

> Es posible que al descargar el proyecto con HTTPs, muestre siguiente error:
> ```sh
> Cloning into 'nombre-del-proyecto'...
> fatal: unable to access 'https://url-del-proyecto.git/': server certificate verification >failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none
> ```


> Configurar lo siguiente e intentar nuevamente la clonación:
> ```sh
> git config --global http.sslverify false
> ```

2. Ingresar a la carpeta.

```sh
$ cd base-backend
```

3. Verificar que se encuentra en la rama master o develop.

```sh
$ git branch
```

4. Instalar las dependencias de paquetes npm

```sh
$ npm run instalar
```

## Configuraciones

1. Copiar archivos de configuración y modificarlos según necesidad.

```sh
$ cp src/common/config/db.js.sample src/common/config/db.js
$ cp src/common/config/mail.js.sample src/common/config/mail.js
$ cp src/common/config/openid.js.sample src/common/config/openid.js
$ cp src/common/config/logs.js.sample src/common/config/logs.js
```

2. Si se usa ciudadanía digital, configurar URL, client, client_params `nano src/common/config/openid.js`

```js
const openid = {
  // issuer server openid connect
  issuer: 'https://OPENID_URL',
  // response registry client
  client: {
    ...
  },
  // parameters registry client
  client_params: {
    scope: ['openid profile email']
  }
};
```

3. Configurar correo electrónico `nano src/common/config/mail.js` (opcional)

```js
const correoConfig = {
  origen: process.env.EMAIL_SENDER || 'info@dominio.gob.bo',
  host: process.env.EMAIL_HOST || 'smtp.dominio.gob.bo',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  ignoreTLS: false,
  auth: {
    user: '<unusuario@dominio.gob.bo>',
    pass: '<password>'
  },
  tls: {
    rejectUnauthorized: false
  },
  logging: s => debug(s)
};
```

4. Configurar correo electrónico `nano src/common/config/db.js`

```js
const db = {
  database: process.env.DB_NAME || 'proyecto',
  username: process.env.DB_USER || 'usuario',
  password: process.env.DB_PASS || 'usuario',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  timezone: 'America/La_Paz',
  logging: s => debug(s)
};
```

5. Para configurar los logs del sistema `nano src/common/config/logs.js`

```js
const logsConfig = {
  // Donde guardar los logs?
  // - 'database': Guardar en la base de datos (se usa db.js para acceder)
  // - 'filesystem': Guardar en sistema de archivos
  storage: 'filesystem',
  
  // Las siguientes opciones solo se toman en cuenta si storage = 'filesystem'
  // para mostrar los logs tambien en la consola
  console: process.env.NODE_ENV === 'production' ? false : true,
  // directorio con los logs
  outputDirectory: './logs',
  // nombre de archivo de logs
  outputFilename: 'logs.log',
  // formato de logs
  format: 'combined',
  // nivel de verbosidad, posibles: error, info, warning, debug
  level: 'info'
};
```

## Inicializar la base de datos

1. Ejecutar lo siguiente para crear las tablas, esto eliminará las tablas y los datos de estas para reescribirlos.

```sh
$ env NODE_ENV=production npm run setup
```

2. Ejecutar lo siguiente para poblar las tablas con datos iniciales.

```sh
$ env NODE_ENV=production npm run seeders
```

> Los seeders ponen 123456 como contraseña de los usuarios.

## Iniciar el servicio con pm2

```sh
$ env NODE_ENV=production pm2 start src/application/server.js --name "proyecto-api"
```

## Configurar Nginx

Editar el archivo de configuración `nano /etc/nginx/sites-enabled/default`

Agregar las siguientes lineas

```sh
  ...
  location /myapp/ {
    proxy_pass http://localhost:3000/;
  }
  ...
```

Reiniciar el servicio

```sh
$ sudo service nginx restart
```

---
