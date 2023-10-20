class appError extends Error {
    constructor(){
        super();
    }
    create(message, statusCode , statusText){
        this.message = message;
        this.statusCode = statusCode;
        this.statusText = statusText;
        return this;
    }
}

export default new appError