var AppRouter = new (Backbone.Router.extend({
    routes: {
        '': 'index',
        'appointments/:id': 'show'
    },

    initialize: function() {
        this.appointmentList = new AppointmentList();
    },

    start: function() {
        Backbone.history.start({ pushState: true });
    },

    index: function() {
        var appointmentsView = new AppointmentListView({ collection: this.appointmentList });
        appointmentsView.render();

        $('#app').html(appointmentsView.el);
        this.appointmentList.fetch();
    },

    show: function(id) {
        var appointment     = new Appointment({ id: id });
        var appointmentView = new AppointmentView({ model: appointment });

        appointment.fetch();
        appointmentView.render();

        $('#app').html(appointmentView.el);
    }
}));

$(function() { AppRouter.start(); });

router.navigate('appointments/1', { trigger: true });