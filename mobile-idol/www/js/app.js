var app = {

	remainingTemplates: 0,
	templates: [
		{
	    	id: '#panel_login',
	    	uri: 'templates/login.template.html'
    	},
		{
	    	id: '#panel_home',
	    	uri: 'templates/home.template.html'
    	},
    	{
    		id: '#panel_leaderboard',
    		uri: 'templates/leaderboard.template.html'
    	},
    	{
    		id: '#panel_category',
    		uri: 'templates/category.template.html'
    	},
    	{
    		id: '#panel_new_video',
    		uri: 'templates/new-video.template.html'
    	},
    	{
    		id: '#panel_edit_video',
    		uri: 'templates/edit-video.template.html'
    	},
    	{
    		id: '#panel_view_video',
    		uri: 'templates/view-video.template.html'
    	},
    	{
    		id: '#panel_confirm_video',
    		uri: 'templates/confirm-video.template.html'
    	},
    	{
    		id: '#panel_profile',
    		uri: 'templates/profile.template.html'
    	}
    ],

	initialize: function () {
        this.templatesBuild();
        this.bind();
	},

	bind: function () {
    	var b = $('body');

    	// Show nav
        $('#wrapper').find('.navbar-toggle').on('click', function (e) {
	        e.preventDefault();
	        b.toggleClass('open');
        });

        // Record video
        $(document).on('click', '.btn-record', function(e) {
        	e.preventDefault();
        	navigator.device.capture.captureVideo(app.videoSuccess, app.videoError, {limit: 1});
         });
	},

	videoSuccess: function(videos) {

		navigator.notification.alert('UPLOADING8: ' + videos[0].fullPath + ' - ' + videos[0].name, null, 'UPLOADING');

		var ft = new FileTransfer(),
            path = videos[0].fullPath,
            name = videos[0].name;

        ft.upload(path,
            "http://hackathon.bobbyearl.com/upload.php",
            function(result) {
                navigator.notification.alert('SUCCESS: ' + result.response, null, 'UPLOADING');
            },
            function(error) {
                navigator.notification.alert('ERROR: ' + error.code, null, 'UPLOADING');
            },
            { fileName: name });

	},

	videoError: function() {
		navigator.notification.alert('ERROR', null, 'ERROR');
	},

	templatesBuild: function () {
		var module = this;
		this.remainingTemplates = this.templates.length;
    	for (var i = 0, j = this.templates.length; i < j; i++) {
    		$.ajax({
    			url: this.templates[i].uri,
    			context: this.templates[i],
    			success: function(html) {
    				this.template = Handlebars.compile(html);
    				if (--module.remainingTemplates == 0) {
    					module.templatesUpdate();
    					module.templatesReady();
    				}
    			}
    		});
    	}
	},

	templatesUpdate: function (context, id) {
		for (var i = 0, j = this.templates.length; i < j; i++) {
			if (id === undefined || this.templates[i].id == id) {
				$(this.templates[i].id).html(this.templates[i].template(context));
			}
		}
	},
	
	templatesVisible: function (panelSelector) {
		$('.handlebars_panel').hide();
		$(panelSelector).fadeIn('fast');
		$('body').removeClass('open');
	},
	
	templatesReady: function () {
	
		var that = this;
	
		$('[data-panel-selector]').on('click', function (e) {
			e.preventDefault();
			that.templatesVisible($(this).attr('data-panel-selector'));
		});
	
		var url = "http://hackathon.bobbyearl.com/users";
		$.ajax({
			url: url,
			context: this,
			success: function (response) {
				this.templatesUpdate(response, '#panel_title');
			},
			dataType: 'json'
		});
	}
};

    	
