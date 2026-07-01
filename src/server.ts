import app from "./app.js"
import { SERVER_PORT } from "./core/constants/app.constants.js";

app.listen(SERVER_PORT, () => {
    // El servidor escuchara en localhost en el puerto especificado
    console.log(`Server listening in http://127.0.0.0:${SERVER_PORT}`)
});
