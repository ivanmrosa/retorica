/*csrf for django*/
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


//cria a funcionalidade icontains no JQUERY
jQuery.expr[":"].icontains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

//CRIA A BIBLIOTECA mainLib
mainLib = {};


/*
 Format é uma função para evitar concatenação de strings. Passe o parâmetro %s onde se quer
 colocar um valor concatenado e eles serão substituidos pela lista informada.
 Parametros:
  - str : String onde quer se inserir o valor
  - list : Lista de strings que deverão substituir os parâmetros %s(na ordem)

*/

mainLib.format = function(str, list){
		var i = 0;		
		var text = str;
		for(i = 0; i <= list.length - 1; i++){
		   text = text.replace("%s", list[i]);		   
		};
		return text;
	};



/*popus e dialogos*/
mainLib.popup = {}
mainLib.popup.open = false;


mainLib.popup.openPopup = function(select){
   var ele = document.querySelector(select);
    
    if(!ele){
    	ele = document.querySelector("#" + select);
    };
    
    if(ele){
    	ele.setAttribute('style', 'display:table');
    }
       mainLib.popup.open = true;
   
}

mainLib.popup.closePopup = function(id_filter, fnToExecuteAfter){
   

    var ele = document.querySelector("#" + id_filter);
	
	if(ele){
		ele.setAttribute('style', 'display:none');
	}
    
    mainLib.popup.open = false;
    
    if (fnToExecuteAfter) {
        fnToExecuteAfter.call();
    }
    
}

mainLib.popup.removePopup = function(id_filter, fnToExecuteAfter){
   $("#" + id_filter).remove();
    if (fnToExecuteAfter) {
        fnToExecuteAfter.call();
    }   
}



mainLib.aviso = function(message, fnToExecuteAfter){
    var html =
          '<div class="col col-1"></div>'+
          '<div class="col col-8"> '+
          '  <div class="popup-body popup-dlg small-radius col-10">	'+
 	      '    <h2 class="yellow title">Aviso !</h2> '+
          '    <p > <center>' + message + ' </center></p>'+          
 	  	  '    <a id="vmsisMsgBtn" href="javascript:void(0)" class="btn full-width btn-orange small-radius">OK</a>'+
 	      '  </div> '+
          '</div> ';
 
    var popupE = document.createElement('div');
    popupE.setAttribute('class', 'popup');
    popupE.setAttribute('id', 'vmsisMsg');
    popupE.innerHTML += html
    
    try{        
        document.querySelector('body').appendChild(popupE); 
    }catch(e){
        console.log(e);
    };
    document.getElementById("vmsisMsgBtn").executeAfter = fnToExecuteAfter;
    document.getElementById("vmsisMsgBtn").addEventListener('click', function(){
       mainLib.popup.removePopup("vmsisMsg", this.executeAfter);
    });

    mainLib.popup.openPopup('vmsisMsg');    
}

mainLib.confirma = function(message, executeIfTrue, executeIfFalse){
    var html =
          '  <div class="popup-body popup-dlg small-radius">	'+
 	      '    <h2 class="yellow title">Confirmação ! </h2> '+
          '    <p><center> ' + message + ' </center> </p>'+          
 	  	  '   <div> <a href="javascript:void()" id="vmsisMsgBtnYes" class="btn full-width btn-green small-radius">Sim</a> '+
          '    <a href="javascript:void()" id="vmsisMsgBtnNo" class="btn btn-red full-width small-radius">Não</a> </div>'+
 	      '  </div> ';
 
    var popupE = document.createElement('div');
    popupE.setAttribute('class', 'popup small-radius');
    popupE.setAttribute('id', 'vmsisMsg');
    popupE.innerHTML += html
    
    try{
        document.querySelector('body').appendChild(popupE);
    }catch(e){
        console.log(e);
    };

    document.getElementById("vmsisMsgBtnYes").executeAfter = executeIfTrue;
    document.getElementById("vmsisMsgBtnNo").executeAfter = executeIfFalse;
    document.getElementById("vmsisMsgBtnYes").addEventListener('click', function(){      
       mainLib.popup.removePopup("vmsisMsg", this.executeAfter);
    });
    document.getElementById("vmsisMsgBtnNo").addEventListener('click', function(){       
       mainLib.popup.removePopup("vmsisMsg", this.executeAfter);
    });

    mainLib.popup.openPopup('vmsisMsg');
        
}


/*treeview*/

mainLib.treeView = function(idTreeView, fnExecuteOnItenClick){
    
	$('#' + idTreeView + '.tree-view ul li').each(function(){
		var ele = $(this).children('ul');
		if(ele.length > 0){			
		   $(this).addClass('has-child');
    	}else{
		   $(this).addClass('has-no-child');
		};
               

	    $(this).click(function(e){
		    $(this).parents('.tree-view').find('.selected').removeClass('selected');	
            $(this).addClass('selected');
            
            var ele = $(this).children('ul');
			if(ele.length > 0){
			    if($(this).hasClass('opened')){
			    	$(this).removeClass('opened');
			    }else{
			        $(this).addClass('opened');
			    };
			};
			      
	 	    if (ele.hasClass('node-active')){
		   	    ele.removeClass('node-active');
		    }else{
		   	    ele.addClass('node-active');
	        }
            
            if (fnExecuteOnItenClick) {
               if(typeof fnExecuteOnItenClick == 'function'){
                  fnExecuteOnItenClick.call(this);
               }
            }
		    e.stopPropagation();			    	
	    });
		
	});	
}

mainLib.listImage = function(id, container, bindTo, data_stringfy){
    imagens = JSON.parse(data_stringfy);
    sel = $(bindTo).val();
    
    $(container).append(mainLib.format('<div id="%s" class="sel-imglist cur-pointer" > </div>', [id + 'sel-imglist']));
         
    
    $(container).append(mainLib.format('<div class="popup" id="%s">  '+
                                        '  <div class="popup-body no-top-margin popup-filter"> '+
                                        '    <a class="page-close fixed" href="javascript:void(0)" title="Fechar" >X</a>'+
                                        '    <div class="imglist"></div> '+
                                        '  </div> '+
                                        '</div>',
                                        [id, id]))
    $('#' + id + ' > .popup-body > .page-close' ).click(function(){
       mainLib.popup.closePopup(id);    
    });
    for (img in imagens) {
      
      $("#" + id + ' .imglist').append(mainLib.format('<div class="flo-left bigger-on-hover cur-pointer imglist-item" style="margin:5px" data-value="%s"> <img src="%s"></img></div>',
          [img,imagens[img]]))
    }
   
    $('#' + id +  ' .imglist-item').click(function(){
       $('#' + id + ' .imglist-item').removeClass('selected');
       $(this).addClass('selected');
       $('#' + id + 'sel-imglist').html($(this).html());
       mainLib.popup.closePopup(id);
       $(bindTo).val($(this).attr('data-value'));
    });
   
    if (sel) {
       $('#' + id +  'sel-imglist').html( $(mainLib.format('[data-value="%s"]', [sel])).html());
    }else{
       $('#' + id +  'sel-imglist').html('<span class="red">Selecione uma imagem...</span>');  
    }
   
    $('#' + id +  'sel-imglist').click(function(){
       mainLib.popup.openPopup(id);
    })

}


/************* utils methods*/

mainLib.createObject = function(proto) {

    function ctor() {}

    ctor.prototype = proto;

    return new ctor();

}

mainLib.makeChild = function(dad, constructor) {

    var soon = constructor || function() {}

    soon.prototype = mainLib.createObject(dad.prototype);

    soon.constructor = soon;

    return soon;

}


mainLib.hasClass = function(cl, element) {

    var clElement = element.getAttribute('class');

    if (!clElement) {

        return false

    };

    var exp = mainLib.format('^(%s)\\s|^(%s)$|\\s(%s)\\s|\\s(%s)$', [cl.trim(), cl.trim(), cl.trim(),

        cl.trim()
    ]);

    var reg = new RegExp(exp);

    reg.ignoreCase = true;

    return reg.test(clElement.trim());

}

mainLib.removeClass = function(cl, element) {

    cls = element.getAttribute('class');

    if (!cls)
        return

    var exp = mainLib.format('^(%s)\\s|^(%s)$|\\s(%s)\\s|\\s(%s)$', [cl.trim(), cl.trim(), cl.trim(),

        cl.trim()
    ]);

    var reg = new RegExp(exp, 'gi');

    element.setAttribute('class', cls.replace(reg, ' '));

}

mainLib.replace = function(str, strToReplace, strReplaceTo) {

    var reg = new RegExp(strToReplace, 'gi');

    return str.replace(reg, strReplaceTo);

}

mainLib.addClass = function(cl, element) {

    cls = element.getAttribute('class');

    if (!mainLib.hasClass(cl, element)) {

        element.setAttribute('class', cls + ' ' + cl);

    }

}

mainLib.loopElements = function(listOfElements, routine) {

    if (listOfElements) {

        for (var i = 0; i < listOfElements.length; i++) {

            listOfElements[i].hasClass = function(cl) {

                return mainLib.hasClass(cl, listOfElements[i])

            }

            listOfElements[i].rmCl = function(cl) {

                mainLib.removeClass(cl, listOfElements[i])

            };

            listOfElements[i].adCl = function(cl) {

                mainLib.addClass(cl, listOfElements[i])

            };

            listOfElements[i].find = function(selector){
                return mainLib.find(selector, this)
            }

            routine.call(listOfElements[i]);

        }

    }

}

mainLib.find = function(selector, parent) {
    var doc = parent || document;

    this.foundElements = doc.querySelectorAll(selector);

    var result = {};

    result.loop = function(routine) {

        mainLib.loopElements(this.elements, routine);

    };

    result.rmCl = function(class_name){
        for(var i=0; i <= this.elements.length -1; i++ ){
            mainLib.removeClass(class_name, this.elements[i])
        }
    };
    result.adCl = function(class_name){
        for(var i=0; i <= this.elements.length -1; i++ ){
            mainLib.addClass(class_name, this.elements[i])
        }
    };

    result.elements = this.foundElements;

    return result;

}

/***********COMPONENTS*****************/

mainLib.simpleComponent = function(tag, parent) {

    /*private*/

    var tagName = tag;

    /*public*/

    this.htmlName;

    this.htmlId;

    //this.hasCloseTag = true;

    this.parent = parent || document.body;

    this.getTagName = function() {

        return tagName;

    }

}

mainLib.visualComponent = mainLib.makeChild(mainLib.simpleComponent, function(tag, parent) {

    this.htmlClass;

    this.htmlWidth;

    this.htmlHeight;

    this.htmlType;

    this.extraAttrs = {};

    this.htmlElement;

    this.events = {};

    mainLib.simpleComponent.call(this, tag, parent);

});

mainLib.visualComponent.prototype.draw = function() {

    var bindAttr = function(ele, attr, val) {

        if (val) {

            ele.setAttribute(attr, val)

        };

    }

    var bindEvent = function(ele, event, method) {

        ele.addEventListener(event, method);

    }

    var ele = document.createElement(this.getTagName());

    bindAttr(ele, 'name', this.htmlName);

    bindAttr(ele, 'id', this.htmlId);

    bindAttr(ele, 'class', this.htmlClass);

    bindAttr(ele, 'width', this.htmlWidth);

    bindAttr(ele, 'height', this.htmlHeight);

    bindAttr(ele, 'type', this.htmlType);

    for (attr in this.extraAttrs) {

        bindAttr(ele, attr, this.extraAttrs[attr]);

    }

    for (event in this.events) {

        bindEvent(ele, event, this.events[event]);

    }

    this.htmlElement = ele;

    this.parent.appendChild(ele);

}

mainLib.text = function(value, parent) {

    var text = document.createTextNode(value);

    var mainElement = parent || document.body;

    mainElement.appendChild(text);

}

mainLib.panel = mainLib.makeChild(mainLib.visualComponent, function(parent) {

    mainLib.visualComponent.call(this, 'div', parent);

})

mainLib.input = mainLib.makeChild(mainLib.visualComponent, function(parent) {

    mainLib.visualComponent.call(this, 'input', parent);

})

mainLib.inputText = mainLib.makeChild(mainLib.input, function(parent) {

    this.htmlType = 'text';

    mainLib.input.call(this, parent);

})

mainLib.inputNumber = mainLib.makeChild(mainLib.input, function(parent) {

    this.htmlType = 'number';

    mainLib.input.call(this, parent);

})

mainLib.inputDate = mainLib.makeChild(mainLib.input, function(parent) {

    this.htmlType = 'date';

    mainLib.input.call(this, parent);

})

mainLib.inputDate = mainLib.makeChild(mainLib.input, function(parent) {

    this.htmlType = 'date';

    mainLib.input.call(this, parent);

})

mainLib.form = mainLib.makeChild(mainLib.visualComponent, function(parent) {

    mainLib.visualComponent.call(this, 'form', parent);

})

mainLib.componentWithText = mainLib.makeChild(mainLib.visualComponent, function(tag, value, parent) {

    this.parent = parent;

    this.value = value;

    mainLib.visualComponent.call(this, tag, this.parent);

})

mainLib.componentWithText.prototype.draw = function() {

    mainLib.visualComponent.prototype.draw.call(this, this.parent);

    text = new mainLib.text(this.value, this.htmlElement);

}

mainLib.label = mainLib.makeChild(mainLib.componentWithText, function(value, labelFor, parent) {

    this.parent = parent;

    this.value = value;

    mainLib.componentWithText.call(this, 'label', this.value, this.parent);

    this.extraAttrs.for = 'labelFor';

})

mainLib.lookupOption = mainLib.makeChild(mainLib.componentWithText, function(value, text, parent) {

    this.parent = parent;

    this.value = value;

    this.text = text;

    mainLib.componentWithText.call(this, 'option', this.text, this.parent);

    this.extraAttrs.value = this.value;

})

mainLib.lookup = mainLib.makeChild(mainLib.visualComponent, function(parent) {

    this.options = {};

    mainLib.visualComponent.call(this, 'select', parent);

})

mainLib.lookup.prototype.draw = function() {

    mainLib.visualComponent.prototype.draw.call(this);

    for (option in this.options) {

        opt = new mainLib.lookupOption(option, this.options[option], this.htmlElement);

        opt.draw();

    }

}

mainLib.bootsPanelComplex = mainLib.makeChild(mainLib.visualComponent, function(title, parent) {

    mainLib.visualComponent.call(this, 'div', parent);

    this.htmlClass = "panel panel-primary"

    this.panelHeading;

    this.panelBody;

    this.panelFooter;

    this.title = title;

})

mainLib.bootsPanelComplex.prototype.draw = function() {

    mainLib.visualComponent.prototype.draw.call(this);

    head = new mainLib.panel(this.htmlElement);

    head.htmlClass = "panel-heading";

    head.draw();

    this.panelHeading = head.htmlElement;

    new mainLib.text(this.title, this.panelHeading);

    var body = new mainLib.panel(this.htmlElement);

    body.htmlClass = "panel-body";

    body.draw();

    this.panelBody = body.htmlElement;

    var footer = new mainLib.panel(this.htmlElement);

    footer.htmlClass = "panel-footer";

    footer.draw();

    this.panelFooter = footer.htmlElement;

}

mainLib.image = mainLib.makeChild(mainLib.visualComponent, function(src, parent) {

    mainLib.visualComponent.call(this, 'img', parent);

    this.extraAttrs.src = src;

})

mainLib.link = mainLib.makeChild(mainLib.visualComponent, function(href, parent) {

    mainLib.visualComponent.call(this, 'a', parent);

    this.extraAttrs.href = href;

})

mainLib.linkImage = mainLib.makeChild(mainLib.visualComponent, function(src, href, parent) {

    mainLib.visualComponent.call(this, 'a', parent);

    this.src = src;

    this.href = href;

    this.extraAttrs.href = this.href;

    this.imgAlt;

})

mainLib.linkImage.prototype.draw = function() {

    mainLib.visualComponent.prototype.draw.call(this);

    var img = new mainLib.image(this.src, this.htmlElement);

    img.extraAttrs.alt = this.imgAlt;

    img.draw();

}

mainLib.pageControl = mainLib.makeChild(mainLib.visualComponent, function(parent) {

    mainLib.visualComponent.call(this, 'div', parent);

    this.htmlClass = 'page-control';

    this.dataTabs = [];

    this.listTabs = [];

    this.elementsTabs = {};

});

mainLib.pageControl.prototype.addTab = function(idAba, caption, htmlElementChild) {

    this.dataTabs.push({
        "caption": caption,
        "element": htmlElementChild,
        "id": idAba
    });

}

mainLib.pageControl.prototype.activeTab = function(idTab) {


    for (var i = 0; i <= this.htmlElement.childElementCount - 1; i++) {

        for (var a = 0; a <= this.htmlElement.childNodes[i].childElementCount - 1; a++) {

            mainLib.removeClass('active', this.htmlElement.childNodes[i].childNodes[a]);

        }

    }

    mainLib.find(mainLib.format("div[data-tab='%s']", [idTab])).loop(function() {

        this.adCl('active');

        var gbody = this.parentNode;
        if(getComputedStyle(gbody, null).display == 'none'){
           mainLib.addClass('active', gbody);
        }

    });

    mainLib.find("#" + idTab).loop(function() {

        this.adCl('active');

    });

}

mainLib.pageControl.prototype.draw = function() {

    mainLib.visualComponent.prototype.draw.call(this);

    var groupTabs = new mainLib.panel(this.htmlElement)

    groupTabs.htmlClass = 'tabs-group';

    groupTabs.draw();

    var groupBody = new mainLib.panel(this.htmlElement);

    groupBody.htmlClass = 'body-group';

    groupBody.draw();

    var painelClose = new mainLib.panel(groupBody.htmlElement);
    painelClose.htmlClass = 'flo-left fixed close-tab';
    painelClose.draw();

    var linkClose = new mainLib.link('javascript:void(0)', painelClose.htmlElement);
    linkClose.htmlClass = "circle circle-small-small cancel ";

    var closeTab = function(){
      mainLib.removeClass('active', this.parentNode.parentNode)
    };

    linkClose.events = {"click":closeTab}
    linkClose.draw();


    for (dtab in this.dataTabs) {

        var tab = new mainLib.panel(groupTabs.htmlElement);

        tab.htmlClass = 'tab';

        tab.extraAttrs.id = this.dataTabs[dtab].id;

        tab.draw();

        tab.htmlElement.parent = this;

        tab.htmlElement.addEventListener('click', function() {

            this.parent.activeTab(this.getAttribute('id'));

        });

        this.listTabs.push(tab);

        this.elementsTabs[tab.extraAttrs.id] = tab.htmlElement;

        new mainLib.text(this.dataTabs[dtab].caption, tab.htmlElement);

        var tabBody = new mainLib.panel(groupBody.htmlElement);

        tabBody.htmlClass = 'tab-body';

        tabBody.extraAttrs['data-tab'] = this.dataTabs[dtab].id;

        tabBody.draw();

        if (this.dataTabs[dtab].element) {

            tabBody.htmlElement.appendChild(this.dataTabs[dtab].element);

        }

    }

    if(getComputedStyle(groupBody.htmlElement, null).display != 'none'){
      this.activeTab(this.dataTabs[0].id);
    };

}


mainLib.contextMenu = function(fnExecuteOnItenClick, idContext){
    if (idContext) {
       var context_id = '#' + idContext
    }else{
       var context_id = "";
    }
    
    
    $(context_id + ".contextmenu").each(function(){
        var element = $(this);
        element.css("display","none");
        
        var parent = $(element.attr("data-container"));
        if (parent.length == 0 && element.attr("data-container").substr(0, 1) != '#' ) {
            parent = $("#" + element.attr("data-container"));
        }
        parent.attr('context-data-container', element.attr("data-container"))
        parent.on('contextmenu', function(e){
            var all_context = $(".contextmenu");
            all_context.offset({left:0, top:0});
            all_context.css("display", "none"); 
            
            var ele = $(this);
            
            var context = $("[data-container='" + $(this).attr("context-data-container") + "']");
            context.offset({left:e.clientX, top:e.clientY});
            context.css("display", "block");
            
            if (fnExecuteOnItenClick && typeof fnExecuteOnItenClick === 'function') {
                subEle = context.find('div');
                
                subEle.each(function(){
                   $(this).unbind('click');
                   $(this).click(function(e){
                      fnExecuteOnItenClick.call(ele[0],  this);                      
                   });
                });
            }
            
            e.preventDefault();
                                                
        });
        $(document).on('click', function(e){
            if(e.button == 0){
                var context = $(".contextmenu");
                context.offset({left:0, top:0});
                context.css("display", "none");                                 
            }
        });
    });
};


function control_click(){
    var menuList = document.querySelector('.menu-content');
    if(menuList){
      var menuShow = document.querySelector('.menu');
      var visible = mainLib.hasClass("menu-full", menuList);
      var content = document.querySelector('.menu-content > ul');
      if(!visible){
        mainLib.addClass("menu-full", menuList);
        mainLib.addClass("menu-full", menuShow)
        menuList.setAttribute("style", "display:table !important;");
        menuShow.setAttribute("style", "height:100%");
        content.setAttribute("style", "display:table");
      }else{
        mainLib.removeClass("menu-full", menuList);
        mainLib.removeClass("menu-full", menuShow);
        menuList.setAttribute("style", "");
        menuShow.setAttribute("style", "");
        content.setAttribute("style", "");
      };
    };
};


mainLib.loadMenu = function(){
	var menu = document.querySelector('.menu');
	if(menu){
       var resize = function(){
            var display = window.getComputedStyle(document.querySelector('.menu .menu-content'),
                ':before').getPropertyValue('display');
            menu.removeEventListener('click', control_click, true);
            if(display === 'inline'){
                menu.addEventListener('click',control_click, true);
            };
		};

		window.addEventListener('resize', resize, true);
		window.addEventListener('load', resize, true);
	};
}


/*LOCAL STORAGE DATA*/

mainLib.storage = {};

mainLib.storage.create = function(name) {

    if (localStorage.getItem(name) == null) {

        localStorage.setItem(name, []);

    };

}

mainLib.storage.drop = function(name) {

    if (localStorage.getItem(name) != null) {

        localStorage.removeItem(name);

    };

}

mainLib.storage.get = function(name) {

    mainLib.storage.create(name);

    var sto = localStorage.getItem(name);

    var result = {};

    result.name = name;

    result.storage = eval(sto) || [];

    result.insert = function(data) {

        this.storage.push(data);

    };

    result.select = function(filter) {

        var rows = []

        for (var a = 0; a <= this.storage.length - 1; a++) {

            var row = this.storage[a];

            var expression = mainLib.replace(filter, 'field\\[', 'row[');

            if (eval(expression)) {

                rows.push(row);

            }

        }

        return rows;

    }

    result.delete = function(filter) {

        for (var a = this.storage.length - 1; a >= 0; a--) {

            var row = this.storage[a];

            var expression = mainLib.replace(filter, 'field\\[', 'row[');

            if (eval(expression)) {

                this.storage.splice(a, 1);

            }

        }

    }

    result.update = function(filter, objectFieldValue) {

        for (var a = this.storage.length - 1; a >= 0; a--) {

            var row = this.storage[a];

            var expression = mainLib.replace(filter, 'field\\[', 'row[');

            if (eval(expression)) {

                for (var b in objectFieldValue) {

                    this.storage[a][b] = objectFieldValue[b];

                }

            }

        }

    }

    result.save = function() {

        localStorage.setItem(this.name, JSON.stringify(this.storage));

    }

    return result;

}

/*data server*/

mainLib.server = {}

mainLib.server.post = function(url, data, routineOk, routineNotOk){
  var xhttp = new XMLHttpRequest();
  var csrftoken = getCookie('csrftoken');

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 ) {
      if(xhttp.status == 200){
        routineOk(xhttp.responseText);
      }else{
        routineNotOk(xhttp.responseText);
      };
    };
  };

  xhttp.open("POST", url + "?" + data, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if(!csrfSafeMethod('POST') && !this.crossDomain){
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  };
  xhttp.send(data);
};


/*data binder*/
mainLib.dataBinder = {}

mainLib.dataBinder.bindOnTemplate = function(model, data, parent){
  mainLib.find('[data-model="'+model+'"]', parent).loop(function(){
     if(typeof data != 'object'){
       data = JSON.parse(data);
     }
     var template = this.innerHTML;

     var parser = new DOMParser();
     var details = []
     this.find('[data-model]').loop(function(){
       details.push(this.getAttribute('data-model'));
     });

     for(var row = 0; row < data.length; row ++){
       var columns = data[row];
       var rowTemplate = template;
       for(col in columns){
         if(columns.hasOwnProperty(col)){
           if(!(col in details)){
             rowTemplate = mainLib.replace(rowTemplate, "\\[{" + col + "}\\]", columns[col]);
           };
         };
       };
       var chElements = parser.parseFromString(rowTemplate, 'text/html').body.children;
       while(chElements.length > 0){
         var ele = this.parentNode.insertBefore(chElements[0], this);
         ele.removeAttribute("data-model");
         for(var i = 0; i < details.length; i++){
           mainLib.dataBinder.bindOnTemplate(details[i], columns[details[i]], ele);
         };
       };

     };

  });

  mainLib.find('html:not([data-model]) [data-src]', parent).loop(function(){
    this.setAttribute('src', this.getAttribute('data-src'));
  });
  mainLib.find('html:not([data-model]) [data-href]', parent).loop(function(){
    this.setAttribute('href', this.getAttribute('data-href'));
  });

}


mainLib.dataBinder.formParser = function(selector){
  var frm = mainLib.find(selector).elements[0];
  var data = "";
  for(var i = 0; i < frm.length; i++){
    var ele = frm[i];

    if(ele.type === "checkbox"){
      data += ele.getAttribute("name").toString() + "=" + ele.checked.toString() + "&";
    }else{
      data += ele.getAttribute("name").toString() + "=" + ele.value.toString() + "&";
    }
  }

  return data.substr(0, data.length-1);
}

mainLib.dataBinder.bindServerDataOnTemplate = function(url, model, parent){
  var received = {};
  mainLib.server.post(url, "",
    function(data){
      received = JSON.parse(data);
        mainLib.dataBinder.bindOnTemplate(model, received, parent);
      },
      function(data){
        mainLib.aviso('Ocorreu um erro ao obter os dados necessários.' + data);
      }
  )
}