class AppointmentFactory{

    Build(simpleAppointment){

        var day = simpleAppointment.data.getDate()+1;
        var month = simpleAppointment.data.getMonth();
        var year = simpleAppointment.data.getFullYear();
        var hour =  Number.parseInt(simpleAppointment.hora.split(":")[0]);
        var minutes = Number.parseInt(simpleAppointment.hora.split(":")[1]);

        var startDate = new Date(year,month,day,hour,minutes,0,0);

        var appo = {
            id: simpleAppointment.id,
            title: simpleAppointment.paciente.nome, 
            start: startDate,
            end: startDate
        }
        
        return appo;
    }

}

module.exports = new AppointmentFactory();