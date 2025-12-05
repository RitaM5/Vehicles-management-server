import app from "./app";
import config from "./config/config";


const port = config.port;
app.listen(port, () => {
    console.log(`Vehicle Rental Management app running on port ${port}`);
})