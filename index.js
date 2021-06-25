var cors = require("cors")
const express = require("express")
const app = express()
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const session = require("express-session")
var AppointmentFactory = require("./factories/AppointmentFactory");

const bodyParser = require("body-parser"); //traduzir dados enviados em uma estrutura js
const connection = require("./database/database");
const Usuario = require("./database/users");
const Paciente = require("./database/pacientes");
const Consulta = require("./database/consultas");
const Anamnese = require("./database/anamneses");
const Exame = require("./database/exames");
const Receita = require("./database/receitas");
const { query } = require("express")

const userAuth = require("./middlewares/userAuthenticate")
const medicoAuth = require("./middlewares/medicoAuthenticate")

//configurando sessoes

app.use(session({
    secret: "admin12345", cookie: {maxAge: 36000000} //tempo que usuario pode ficar logado
}))

//fin sessoes

app.use(cors())

app.use(express.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/home", userAuth, (req, res) => {
    res.render("home2")
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Server is started")
})

app.post("/", (req, res) => {

    var email = req.body.email;
    var senha = req.body.senha;

    Usuario.findOne({ where: { email: email } }).then(usuario => {

        if (usuario != undefined) {

            var correct = bcrypt.compareSync(senha, usuario.senha)

            if (correct) {
                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                }
                res.render("home", {
                    usuario: usuario
                });
            }
            else {
                res.redirect("/");
            }
        }
        else {
            res.redirect("/");
        }
    })

})

app.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

//busca

async function search(query){
    try{
        var listPac = await Paciente.findOne({ where: { nome: query }})
        return listPac
    }catch(err){
        console.log(err)
        return []
    }
    
    
}

app.get("/pacientes", (req, res) => {
   

    Paciente.findAll().then(paciente => {
        res.render("locpaciente", { pacientes: paciente });
    });

});

app.get("/searchresult", async (req, res) => {
    var pacientes = await search(req.query.search)
    res.render("locpaciente", { pacientes: pacientes })
})
//gerenciando paciente

app.get("/novoPaciente", userAuth, (req, res) => {
    res.render("cadastro")
})

app.post("/salvarPaciente", userAuth, (req, res) => {

    var nome = req.body.nome;
    var prontuario = req.body.prontuario;
    var dataCadastro = req.body.dataCadastro;
    var nascimento = req.body.nascimento;
    var convenio = req.body.convenio;
    var sexo = req.body.sexo;
    var estadoCivil = req.body.estadoCivil;
    var cor = req.body.cor;
    var naturalidade = req.body.naturalidade;
    var cpf = req.body.cpf;
    var profissao = req.body.profissao;
    var email = req.body.email;
    var logradouro = req.body.logradouro;
    var complemento = req.body.complemento;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var observacoes = req.body.observacoes;
    var uf = req.body.uf;
    var cep = req.body.cep;
    var telefone = req.body.telefone;

    if (Paciente != undefined) {

        Paciente.create({

            nome: nome,
            prontuario: prontuario,
            dataCadastro: dataCadastro,
            nascimento: nascimento,
            convenio: convenio,
            sexo: sexo,
            estadoCivil: estadoCivil,
            cor: cor,
            naturalidade: naturalidade,
            cpf: cpf,
            profissao, profissao,
            email: email,
            logradouro: logradouro,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            observacoes: observacoes,
            uf: uf,
            cep: cep,
            telefone: telefone

        }).then(() => {
            res.redirect("/pacientes");
        });

    } else {
        res.redirect("/novoPaciente");
    }
})

app.get("/pacientes", userAuth, (req, res) => {

    Paciente.findAll().then(pacientes => {
        res.render("locpaciente", { pacientes: pacientes });
    });

});

app.get("/pacientes/perfil/:id", userAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findByPk(id).then(paciente => {

        if (isNaN(id)) {
            res.redirect("/pacientes");
        }
        if (paciente != undefined) {
            res.render("perfilPaciente", { paciente: paciente });
        } else {
            res.redirect("/pacientes");
        }

    }).catch(erro => {
        res.redirect("/pacientes");
    });

});

app.post("/pacientes/delete", userAuth, (req, res) => {
    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) { //id é numerico ou não

            Paciente.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/pacientes");
            })

        } else {
            res.redirect("/pacientes");
        }

    } else {
        res.redirect("/pacientes");
    }
});

app.get("/pacientes/perfil/edit/:id", userAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findByPk(id).then(paciente => {

        if (isNaN(id)) {
            res.redirect("/pacientes/perfil/:id");
        }

        if (paciente != undefined) {
            res.render("editPaciente", { paciente: paciente });
        } else {
            res.redirect("/pacientes/perfil/:id");
        }

    }).catch(erro => {
        res.redirect("/pacientes/perfil/:id");
    });

});

app.post("/pacientes/update", userAuth, (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var prontuario = req.body.prontuario;
    var dataCadastro = req.body.dataCadastro;
    var nascimento = req.body.nascimento;
    var convenio = req.body.convenio;
    var sexo = req.body.sexo;
    var estadoCivil = req.body.estadoCivil;
    var cor = req.body.cor;
    var naturalidade = req.body.naturalidade;
    var cpf = req.body.cpf;
    var profissao = req.body.profissao;
    var email = req.body.email;
    var logradouro = req.body.logradouro;
    var complemento = req.body.complemento;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var observacoes = req.body.observacoes;
    var uf = req.body.uf;
    var cep = req.body.cep;
    var telefone = req.body.telefone;

    Paciente.update({
        nome: nome,
        prontuario: prontuario,
        dataCadastro: dataCadastro,
        nascimento: nascimento,
        convenio: convenio,
        sexo: sexo,
        estadoCivil: estadoCivil,
        cor: cor,
        naturalidade: naturalidade,
        cpf: cpf,
        profissao, profissao,
        email: email,
        logradouro: logradouro,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        observacoes: observacoes,
        uf: uf,
        cep: cep,
        telefone: telefone
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/pacientes/perfil/:id");
    });


});

//gerenciando consultas

app.get("/agenda", userAuth, (req, res) => {

    res.render("date");

})

app.get("/agenda2", userAuth, (req, res) => {

    Consulta.findAll({
        include: [{//pega dados do relacionamento
            model: Paciente,
        }],
        order: [
            ['hora', 'DESC']
        ] 
    }).then(consultas => {

        var appointments = [];

        consultas.forEach(appointment => {
            appointments.push( AppointmentFactory.Build(appointment))              
        });

        res.json(appointments);
        
    });

})

app.get("/novaConsulta", userAuth, (req, res) => {

    Consulta.findAll({
        include: [{//pega dados do relacionamento
            model: Paciente,
        }]
    }).then(consultas => {
        Paciente.findAll().then(pacientes => {
            res.render("novaConsulta", { consultas: consultas, pacientes: pacientes });
        })
    });

})

app.get("/agenda/:data", userAuth, (req, res) => {

    var data = req.params.data;

    Consulta.findAll({
        where: {
            data: data,
        },
    }).then(consultas => {
        res.render("date", { consultas: consultas });
    });

})

app.post("/salvarConsulta", userAuth, (req, res) => {

    var data = req.body.data;
    var hora = req.body.hora;
    var tipo = req.body.tipo;
    var convenio = req.body.convenio;
    var valor = req.body.valor;
    var status = req.body.status;
    var chegada = req.body.chegada;
    var atendido = req.body.atendido;
    var notas = req.body.notas;
    var paciente = req.body.paciente;

    if (Consulta != undefined) {

        Consulta.create({

            data: data,
            hora: hora,
            tipo: tipo,
            convenio: convenio,
            valor: valor,
            status: status,
            chegada: chegada,
            atendido: atendido,
            notas: notas,
            pacienteId: paciente,

        }).then(() => {
            res.redirect("/agenda");
        });

    } else {
        res.redirect("/agenda");
    }
})

app.get("/agenda/consulta/:id", userAuth, (req, res) => {

    var id = req.params.id;

    Consulta.findAll({
        where: {
            id: id,
        },
        include: [{
            model: Paciente,
        }] //pega dados do relacionamento
    
    }).then(consultas => {

        if (isNaN(id)) {
            res.redirect("/agenda");
        }
        if (consultas != undefined) {
            res.render("dateEscolhida", { consultas: consultas });
        } else {
            res.redirect("/agenda");
        }

    }).catch(erro => {
        res.redirect("/agenda");
    });

});

app.post("/agenda/consulta/delete", userAuth, (req, res) => {
    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) { //id é numerico ou não

            Consulta.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/agenda");
            })

        } else {
            res.redirect("/agenda");
        }

    } else {
        res.redirect("/agenda");
    }
});

app.get("/agenda/consulta/edit/:id", userAuth, (req, res) => {

    var id = req.params.id;

    Consulta.findAll({
        where: {
            id: id,
        },
        include: [{
            model: Paciente,
        }] //pega dados do relacionamento
    
    }).then(consultas => {

        if (isNaN(id)) {
            res.redirect("/agenda/consulta/:id");
        }

        if (consultas != undefined) {
            Paciente.findAll().then(pacientes => {
                res.render("editConsulta", { consultas: consultas, pacientes: pacientes });
            })
        } else {
            res.redirect("/agenda/consulta/:id");
        }

    }).catch(erro => {
        res.redirect("/agenda/consulta/:id");
    });

});

app.post("/agenda/consulta/update", userAuth, (req, res) => {
    var data = req.body.data;
    var id = req.body.id;
    var hora = req.body.hora;
    var tipo = req.body.tipo;
    var convenio = req.body.convenio;
    var valor = req.body.valor;
    var status = req.body.status;
    var chegada = req.body.chegada;
    var atendido = req.body.atendido;
    var notas = req.body.notas;
    var paciente = req.body.paciente;

    Consulta.update({
        data: data,
        hora: hora,
        tipo: tipo,
        convenio: convenio,
        valor: valor,
        status: status,
        chegada: chegada,
        atendido: atendido,
        notas: notas,
        pacienteId: paciente,
    }, {
        where: {
            id: id
        }

    }).then(() => {
        res.redirect("/agenda");
    });

});

//recuperarSenha

app.get("/recuperarSenha", (req, res) => {

    res.render("recuperarSenha");

});

app.post("/recuperarSenha", (req, res) => {

    const email = req.body.email
    
    try {
    
    Usuario.findOne({
        where: {
            email: email
        }
    })
    
        const transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "b2cdf13d14f9d6",
                pass: "218f41d04fa05f"
           }
        })
    
            const newPassword = crypto.randomBytes(4).toString('HEX')
    
            transporter.sendMail({
                from: 'Administrador <29d704b73c-ee302f@inbox.mailtrap.io>',
                to: email,
                subject: 'Recuperacao de senha!',
                html: `<p>Ola , sua nova senha para acessar o sistema ${newPassword}</p><br/><a href="http://localhost:5000/">Sistema</a>`
            }).then(
                    () => {
    
                        bcrypt.hash(newPassword, 8).then(
                            Usuario.update({senha : newPassword},{
                                where: {
                                    email: email
                                }
                             }).then(
                                () => {
                                    return res.status(200).json({ message: 'Email sended'})
                                }
                                ).catch(
                                () => {
                                    return response.status(404).json({ message: 'User not found'})
                                }
                            ))
    
                    
                }
            ).catch(
                () => {
                    return res.status(404).json({message: 'fail to send email'})
                }
            )
    
        } catch(error) {
        return res.status(404).json({message : 'User not found'})
    }
    
});

//Dados

app.get("/receitas/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        },
        include: [{model: Receita}]
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("receitas", { paciente: paciente , receitas: paciente.receitas});
        } else {
            res.redirect("/pacientes");
        }

    }).catch(erro => {
        res.redirect("/pacientes");
    });
    
});

app.get("/anamneses/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        },
        include: [{model: Anamnese}]
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("anamneses", { paciente: paciente , anamneses: paciente.anamneses});
        } else {
            res.redirect("/pacientes");
        }

    }).catch(erro => {
        res.redirect("/pacientes");
    });

});

app.get("/exames/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        },
        include: [{model: Exame}]
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("exames", { paciente: paciente , exames: paciente.exames});
        } else {
            res.redirect("/pacientes");
        }

    }).catch(erro => {
        res.redirect("/pacientes");
    });
});

app.get("/receitas/:id/novaReceita", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        }
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("novaReceita", { paciente: paciente });
        } else {
            res.redirect("/receitas/:id");
        }

    }).catch(erro => {
        res.redirect("/receitas/:id");
    });
})

app.get("/anamneses/:id/novaAnamnese", userAuth, medicoAuth, (req, res) => {
    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        }
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("novaAnamnese", { paciente: paciente });
        } else {
            res.redirect("/anamneses/:id");
        }

    }).catch(erro => {
        res.redirect("/anamneses/:id");
    });
})

app.get("/exames/:id/novoExame", userAuth, medicoAuth, (req, res) => {
    var id = req.params.id;

    Paciente.findOne({
        where: {
            id: id
        }
    }).then(paciente => {

        if (paciente != undefined) {
            res.render("novoExame", { paciente: paciente });
        } else {
            res.redirect("/exames/:id");
        }

    }).catch(erro => {
        res.redirect("/exames/:id");
    });
})

app.post("/salvarReceita", userAuth, medicoAuth, (req, res) => {

    var texto = req.body.texto;
    var paciente = req.body.paciente;

    if (Receita != undefined) {

        Receita.create({

            texto: texto,
            pacienteId: paciente,

        }).then(() => {
            res.redirect("/receitas/:id");
        });

    } else {
        res.redirect("/receitas/:id");
    }
})

app.get("/receitas/edit/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Receita.findOne({
        where: {
            id: id
        },
        include: [{model: Paciente}]
    }).then(receita => {

        if (receita != undefined) {
            res.render("editReceita", { receita: receita, paciente: receita.paciente});
        } else {
            res.redirect("/receitas/:id");
        }

    }).catch(erro => {
        res.redirect("/receitas/:id");
    });

});

app.post("/receitas/update", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;
    var texto = req.body.texto;
    var paciente = req.body.paciente;

    Receita.update({
        texto: texto,
        pacienteId: paciente,
    }, {
        where: {
            id: id
        }

    }).then(() => {
        res.redirect("/receitas/:pacienteId");
    });

});

app.post("/receitas/delete", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) { //id é numerico ou não

            Receita.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/receitas/:pacienteId");
            })

        } else {
            res.redirect("/receitas/:pacienteId");
        }

    } else {
        res.redirect("/receitas/:pacienteId");
    }
});


app.post("/salvarExame", userAuth, medicoAuth, (req, res) => {

    var texto = req.body.texto;
    var paciente = req.body.paciente;

    if (Exame != undefined) {

        Exame.create({

            texto: texto,
            pacienteId: paciente,

        }).then(() => {
            res.redirect("/exames/:id");
        });

    } else {
        res.redirect("/exames/:id");
    }
})

app.get("/exames/edit/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Exame.findOne({
        where: {
            id: id
        },
        include: [{model: Paciente}]
    }).then(exame => {

        if (exame != undefined) {
            res.render("editExame", { exame: exame, paciente: exame.paciente});
        } else {
            res.redirect("/exames/:id");
        }

    }).catch(erro => {
        res.redirect("/exames/:id");
    });

});

app.post("/exames/update", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;
    var texto = req.body.texto;
    var paciente = req.body.paciente;

    Exame.update({
        texto: texto,
        pacienteId: paciente,
    }, {
        where: {
            id: id
        }

    }).then(() => {
        res.redirect("/exames/:pacienteId");
    });

});

app.post("/exames/delete", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) { //id é numerico ou não

            Exame.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/exames/:pacienteId");
            })

        } else {
            res.redirect("/exames/:pacienteId");
        }

    } else {
        res.redirect("/exames/:pacienteId");
    }
});


app.post("/salvarAnamnese", userAuth, medicoAuth, (req, res) => {

    var texto = req.body.texto;
    var paciente = req.body.paciente;

    if (Anamnese != undefined) {

        Anamnese.create({

            texto: texto,
            pacienteId: paciente,

        }).then(() => {
            res.redirect("/anamneses/:id");
        });

    } else {
        res.redirect("/anamneses/:id");
    }
})

app.get("/anamneses/edit/:id", userAuth, medicoAuth, (req, res) => {

    var id = req.params.id;

    Anamnese.findOne({
        where: {
            id: id
        },
        include: [{model: Paciente}]
    }).then(anamnese => {

        if (anamnese != undefined) {
            res.render("editAnamnese", { anamnese: anamnese, paciente: anamnese.paciente});
        } else {
            res.redirect("/anamneses/:id");
        }

    }).catch(erro => {
        res.redirect("/anamneses/:id");
    });

});

app.post("/anamneses/update", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;
    var texto = req.body.texto;
    var paciente = req.body.paciente;

    Anamnese.update({
        texto: texto,
        pacienteId: paciente,
    }, {
        where: {
            id: id
        }

    }).then(() => {
        res.redirect("/anamneses/:pacienteId");
    });

});

app.post("/anamneses/delete", userAuth, medicoAuth, (req, res) => {

    var id = req.body.id;

    if (id != undefined) {

        if (!isNaN(id)) { //id é numerico ou não

            Anamnese.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/anamneses/:pacienteId");
            })

        } else {
            res.redirect("/anamneses/:pacienteId");
        }

    } else {
        res.redirect("/anamneses/:pacienteId");
    }
});
