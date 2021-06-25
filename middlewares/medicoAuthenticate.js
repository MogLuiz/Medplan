function medicoAuth(req, res, next){
    if(req.session.usuario.id == 1){
        next();
    }else{
        res.redirect("/");
    }
}

module.exports = medicoAuth