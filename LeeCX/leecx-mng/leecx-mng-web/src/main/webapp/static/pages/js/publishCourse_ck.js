var PublishCourse = function () {

    // 发布课程
	var handlePublishCourse = function() {
		
        $('#courseLessonForm').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            rules: {
            	title: {
                    required: true,
                    rangelength: [6,30]
                },
                oldPrice: {
                    required: true
                },
                newPrice: {
                    required: true
                },
                cover: {
                    required: true
                },
                lessonCounts: {
                    required: true
                },
                introduction: {
                    required: true,
                    rangelength: [6,30]
                }//,
//                description: {
//                    required: true
//                }
            },

            messages: {
            	title: {
                    required: "课程标题不能为空.",
                    rangelength: "课程标题的长度请控制在6-30位."
                },
                oldPrice: {
                    required: "课程价格(老价)不能为空."
                },
                newPrice: {
                    required: "课程价格(新价)不能为空."
                },
                cover: {
                    required: "请上传课程封面图."
                },
                lessonCounts: {
                    required: "请填写本课程的课时数."
                },
                introduction: {
                    required: "请填写本课程的简介.",
                    rangelength: "课程简介的长度请控制在6-50位."
                }//,
//                description: {
//                    required: "课程详情不能为空，丰富的课程详情有助于提高购买率噢."
//                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('#courseLessonForm')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('#input-error'));
            },

            submitHandler: function(form) {
            
//            	var courseLessonForm = $('#courseLessonForm');
//            	var hdnContextPath = $("#hdnContextPath").val();
            	
//            	var title = $("#title").val();
//            	var oldPrice = $("#oldPrice").val();
//            	var newPrice = $("#newPrice").val();
//            	var cover = $("#cover").val();
//            	var difficulty= $ ('input:radio[name="difficulty"]:checked').val();
//            	var lessonCounts = $("#lessonCounts").val();
//            	var introduction = $("#introduction").val();
            	var description = CKEDITOR.instances.description.getData();
           	
            	if (description == "" || description == null) {
            		swal({
                		title: "友情提醒",
          			  	text: "您正在发布课程，但是课程详情为空，若继续提交内容，则用户将在您的课程中看到的详情为空，建议完善课程详情后再提交...",
          			  	type: "warning",
          			  	confirmButtonText: "继续提交!",
          			  	confirmButtonClass: "btn-warning",
          			  	showCancelButton: true,
          			  	cancelButtonText: "噢!等等...",
          			  	confirmButtonColor: "#DD6B55",  
          			  	closeOnConfirm: false
                	}, function(isConfirm) {
          				if (isConfirm) {
          					submitCourse();
          				}
          			});
            	} else {
            		submitCourse();
            	}
            	
            }
        });
        
        var submitCourse = function() {debugger;
        	
        	App.blockUI();
        	
        	// 解决ckeditor不更新内容
        	for( instance in CKEDITOR.instances ){ CKEDITOR.instances[instance].updateElement(); }
        	
        	var courseLessonForm = $('#courseLessonForm');
        	var hdnContextPath = $("#hdnContextPath").val();
        	
        	var title = $("#title").val();
        	var oldPrice = $("#oldPrice").val();
        	var newPrice = $("#newPrice").val();
        	var cover = $("#cover").val();
        	var difficulty= $ ('input:radio[name="difficulty"]:checked').val();
        	var lessonCounts = $("#lessonCounts").val();
        	var introduction = $("#introduction").val();
        	var description = CKEDITOR.instances.description.getData();
        	
        	// 提交发布课程信息
        	courseLessonForm.ajaxSubmit({
        		dataType: "json",
                type: "post", // 提交方式 get/post
                url: hdnContextPath + '/courseLesson/save.shtml', // 需要提交的 url
//                data: {
//                    	"title":title, 
//                    	"oldPrice":oldPrice, 
//                    	"newPrice":newPrice, 
//                    	"cover":cover, 
//                    	"difficulty":difficulty, 
//                    	"lessonCounts":lessonCounts, 
//                    	"introduction":introduction, 
//                    	"description":description
//                      },
                data: courseLessonForm.serialize(),
                success: function(data) {
                    // 登录成功或者失败的提示信息
                    if (data.status == 200 && data.msg == "OK") {
                    	SweetAlert.success("课程创建成功！请至“我的课程”中上传课时");
//                        	courseLessonForm[0].reset();
                    	App.unblockUI();
                    } else {
                    	SweetAlert.error(data.msg);
                    	App.unblockUI();
                    }
                },
                error: function (response, ajaxOptions, thrownError) {
                	Error.displayError(response, ajaxOptions, thrownError); 
                	App.unblockUI();
                }
            });
        }

        $('#courseLessonForm input').keypress(function(e) {
            if (e.which == 13) {
                if ($('#courseLessonForm').validate().form()) {
                    $('#courseLessonForm').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
        
    }
	
    
	// 封面上传
    $('#coverUpload').fileupload({
        dataType: 'json',
        done: function (e, data) {
        	console.log(data);  
        	
        	if (data.result.status != "200") {
        		alert("图片大小不能超过2M...");
        	} else {
                $.each(data.result.data, function (index, file) {
                  $("#coverContent").html("<a href='" + file.url + "' target='_blank'><img src='" + file.url + "' width='500' height='250'></img></a>");
                  $("#cover").attr("value", file.urlDB);
              }); 
        	}
        },
	
		change: function (e, data) {
        	var size = data.files[0].size;
        
    		if((size / 1024 / 1024) > 2) {
				alert("图片大小不能超过2M...");
				return false;
			}
   		}
    });
	
	// input mask
	var handleInputMasks = function () {

        $("#oldPrice").inputmask("9999", {
            placeholder: " ",
            clearMaskOnLostFocus: true
        });
        $("#newPrice").inputmask("9999", {
            placeholder: " ",
            clearMaskOnLostFocus: true
        });
        $("#lessonCounts").inputmask("99999", {
            placeholder: " ",
            clearMaskOnLostFocus: true
        });
    }
    
    return {
        // 初始化各个函数及对象
        init: function () {

        	handlePublishCourse();
        	handleInputMasks();
        	
        }

    };

}();

jQuery(document).ready(function() {
	PublishCourse.init();
});