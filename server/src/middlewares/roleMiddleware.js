export const adminMiddleware = async (request, response, next) => {

    try {
        if (request.user && request.user.role === "admin") {
            next();
            return;
        }
        response.status(403).json({ message: "Only admins can do this!" });

    } catch (error) {
        console.log('Error in adminMiddleware middleware: ', error.message);
        response.status(500).json({ error: 'Internal server error!' });
    }
};

export const creatorMiddleware = async (request, response, next) => {

    try {
        if (
            (request.user && request.user.role === "creator") ||
            (request.user && request.user.role === "admin")
        ) {
            next();
            return;
        }
        response.status(403).json({ message: "Only creators can do this!" });

    } catch (error) {
        console.log('Error in creatorMiddleware middleware: ', error.message);
        response.status(500).json({ error: 'Internal server error!' });
    }
};