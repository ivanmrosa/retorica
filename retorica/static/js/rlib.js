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
   var ele = mainLib.find(select).first();
    
    if(!ele){
    	ele = mainLib.find("#" + select).first();
    };
    
    if(ele){
    	//ele.setAttribute('style', 'display:table');
    	mainLib.removeClass('popup-hide', ele);
    	mainLib.addClass('popup-show', ele)
    }
       mainLib.popup.open = true;
   
}

mainLib.popup.closePopup = function(id_filter, fnToExecuteAfter){
   

   var ele = mainLib.find(id_filter).first();

    if(!ele){
    	ele = mainLib.find("#" + id_filter).first();
    };

    if(ele){
    	//ele.setAttribute('style', 'display:none');
    	mainLib.removeClass('popup-show', ele);
    	mainLib.addClass('popup-hide', ele)
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
          '  <div class="popup-body popup-dlg small-radius">	'+
 	      '    <h2 class="red title">Aviso !</h2> '+
          '    <p > <center>' + message + ' </center></p>'+          
 	  	  '    <a id="vmsisMsgBtn" href="javascript:void(0)" class="btn full-width btn-orange small-radius">OK</a>'+
 	      '  </div> ';

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
    mainLib.find('#vmsisMsgBtn').first().focus();
}

mainLib.confirma = function(message, executeIfTrue, executeIfFalse){
    var html =
          '  <div class="popup-body popup-dlg small-radius">	'+
 	      '    <h2 class="red title">Confirmação ! </h2> '+
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
    mainLib.find('#vmsisMsgBtnNo').first().focus();
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
    if(cls){
      cls = cls.trim();
    };

    if (!mainLib.hasClass(cl, element)) {

        element.setAttribute('class', cls + ' ' + cl.trim());

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

    result.first = function(){
       return this.elements[0];
    };

    result.last = function(){
       return this.elements[this.elements.length - 1];
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
    painelClose.htmlClass = 'flo-right fixed close-tab';
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

mainLib.controle_clicques = 0;

function hideMenu(e){

    var menuList = document.querySelector('.menu-content');
    var menuShow = document.querySelector('.menu');
    var content = document.querySelector('.menu-content > ul');
    var visible = mainLib.hasClass("menu-full", menuList);
    if(visible){
        mainLib.controle_cliques = 1;
        mainLib.removeClass("menu-full", menuList);
        mainLib.removeClass("menu-full", menuShow);
        menuList.setAttribute("style", "height:0%");
        menuShow.setAttribute("style", "height:0%");
        content.setAttribute("style", "");
    }
}

function control_click(e){
    if(mainLib.controle_cliques == 1){
      mainLib.controle_cliques = 0;
      return false;
    };

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
        mainLib.escodermenu = true;
      }else{
        /*mainLib.removeClass("menu-full", menuList);
        mainLib.removeClass("menu-full", menuShow);
        menuList.setAttribute("style", "height:0%");
        menuShow.setAttribute("style", "height:0%");
        content.setAttribute("style", "display:none");*/
        //hideMenu();
      };
    };

};


mainLib.loadMenu = function(){
	var menu = document.querySelector('.menu');
	if(menu){
       var resize = function(){
            mainLib.controle_clicques = 0;
            var display = window.getComputedStyle(document.querySelector('.menu .menu-content'),
                ':before').getPropertyValue('display');
            menu.removeEventListener('click', control_click, true);
            document.removeEventListener('click', hideMenu);
            if(display === 'inline'){
                menu.addEventListener('click',control_click, true);
                document.addEventListener('click', hideMenu, true);
            };
		};

		window.addEventListener('resize', resize, true);
		window.addEventListener('load', resize, true);
	};

    menu.addEventListener('mouseenter', function(){
      this.style.overflow = "auto";
    });
    menu.addEventListener('mouseleave', function(){
      this.style.overflow = "hidden";
    });


}

mainLib.showLocalImage = function(input, img){
  if(input.files && input.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      img.setAttribute('src', e.target.result)
    };
    reader.readAsDataURL(input.files[0]);
  };
}
mainLib.wait = {}

mainLib.wait.start = function(){
  ele = document.createElement('div');
  ele.setAttribute('class', 'wait');
  mainLib.find('body').first().appendChild(ele);
}

mainLib.wait.stop = function(){
  mainLib.find('body').first().removeChild(mainLib.find('.wait').first());
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


mainLib.server.post = function(url, data, routineOk, routineNotOk, async, contentType){
  if(async === undefined || async === null || async === '')
    async = true;
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

  xhttp.open("POST", url, async);
  if(!contentType){
    if(typeof data != "object"){
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    };
  }else{
    xhttp.setRequestHeader("Content-type", contentType);
  };

  /*else{
    xhttp.setRequestHeader("Content-type", "multipart/form-data")
  };*/

  if(!csrfSafeMethod('POST') && !this.crossDomain){
    xhttp.setRequestHeader("X-CSRFToken", csrftoken);
  };

  xhttp.send(data);
};

mainLib.server.get = function(url, data, routineOk, routineNotOk, async){
  if(async === undefined || async === null || async === '')
    async = true;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 ) {
      if(xhttp.status == 200){
        routineOk(xhttp.responseText);
      }else{
        routineNotOk(xhttp.responseText);
      };
    };
  };

  xhttp.open("GET", url + '?' + data, async);
  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
};



/*data binder*/
mainLib.dataBinder = {}

mainLib.dataBinder.bindOnTemplate = function(model, data, parent, empty){
  mainLib.find('[data-model="'+model+'"]', parent).loop(function(){
     if(empty === true)
       data = [{}]

     if(!data){
       return
     }
     if(typeof data != 'object'){
       data = JSON.parse(data);
     }
     var template = "";
     var isSelfContainer = this.hasAttribute('data-self');
     if(isSelfContainer){
       var parentEle = document.createElement('div');
       var thisClone = this.cloneNode(true);
       parentEle.appendChild(thisClone);
       template = parentEle.innerHTML;
     }else{
       template = this.innerHTML;
     }

     var parser = new DOMParser();
     var details = []
     this.find('html:not([data-not-sub]) [data-model]').loop(function(){
       if(this.getAttribute('data-model') != model)
         details.push(this.getAttribute('data-model'));
     });

     for(var row = 0; row < data.length; row ++){
       var columns = data[row];
       var rowTemplate = template;
       if(empty === true){
         rowTemplate = mainLib.replace(rowTemplate, "\\[{.*}\\]", '');
       }else{
         for(col in columns){
           if(columns.hasOwnProperty(col)){
             if(!(col in details)){
               rowTemplate = mainLib.replace(rowTemplate, "\\[{" + col + "}\\]", columns[col]);
             };
           };
         };
       };
       var chElements = parser.parseFromString(rowTemplate, 'text/html').body.children;
       while(chElements.length > 0){
         var ele = this.parentNode.insertBefore(chElements[0], this);
         ele.removeAttribute("data-model");
         ele.setAttribute("data-replicated-model", model)
         for(var i = 0; i < details.length; i++){
           mainLib.dataBinder.bindOnTemplate(details[i], columns[details[i]], ele);
         };
       };
     };
  });

  mainLib.find('[data-replicated-model] [data-src]', parent).loop(function(){
    this.setAttribute('src', this.getAttribute('data-src'));
  });
  mainLib.find('[data-replicated-model] [data-href]', parent).loop(function(){
    this.setAttribute('href', this.getAttribute('data-href'));
  });
  mainLib.find('[data-replicated-model] [data-value] ', parent).loop(function(){
    if(this.getAttribute('data-value') != null &&  this.getAttribute('data-value') != undefined){
      if(this.type == "checkbox" || this.type == "radio"){
        if(this.getAttribute('data-value') == "true"){
          this.checked = true;
        }else{
          this.checked = false;
          this.setAttribute('data-value', false)
        }
      }else{
        this.value = this.getAttribute('data-value');
      };
    };
  });
  mainLib.find('[data-replicated-model] [data-id]', parent).loop(function(){
    this.setAttribute('id', this.getAttribute('data-id'));
  });
  mainLib.find('[data-replicated-model] [data-name]', parent).loop(function(){
    this.setAttribute('name', this.getAttribute('data-name'));
  });
  mainLib.find('[data-replicated-model]').loop(function(){
    if(this.getAttribute('data-src'))
      this.setAttribute('src', this.getAttribute('data-src'));

    if(this.getAttribute('data-href'))
      this.setAttribute('href', this.getAttribute('data-href'));

    if(this.getAttribute('data-value')){
      if(this.type == "checkbox" || this.type == "radio"){
        if(this.getAttribute('data-value') == true){
           this.checked = true;
        }else{
          this.checked = false;
          this.setAttribute('data-value', false)
        }
      }else{
        this.value = this.getAttribute('data-value');
      };
    };
    if(this.getAttribute('data-id'))
      this.setAttribute('id', this.getAttribute('data-id'));

    if(this.getAttribute('data-name'))
      this.setAttribute('name', this.getAttribute('data-name'));

  });
}

mainLib.dataBinder.bindEmptyTemplate = function(model, parent){
  mainLib.dataBinder.bindOnTemplate(model, null, parent, true);
  mainLib.dataBinder.fillLookup('[data-replicated-model="'+model+'"] [data-lookup-url]')
}

mainLib.dataBinder.removeReplicatedModel = function(model, parent){
  mainLib.find('[data-replicated-model="' + model +'"]', parent).loop(function(){
    this.parentNode.removeChild(this);
  });
}

mainLib.dataBinder.formParser = function(selector){
  var frm = mainLib.find(selector).elements[0];
  var data = "";
  for(var i = 0; i < frm.length; i++){
    var ele = frm[i];

    if(!ele.hasAttribute("name"))
      continue;

    if(ele.type === "checkbox"){
      data += ele.getAttribute("name").toString() + "=" + ele.checked + "&";
    }else{
      data += ele.getAttribute("name").toString() + "=" + ele.value.toString() + "&";
    }
  }

  return data.substr(0, data.length-1);
}

mainLib.dataBinder.formParserJson = function(selector){
  var frm = mainLib.find(selector).elements[0];
  var data = "{";
  for(var i = 0; i < frm.length; i++){
    var ele = frm[i];

    if(ele.type === "checkbox"){
      data += '"' + ele.getAttribute("name").toString() + '":"' + ele.checked.toString() + '",';
    }else{
      data += '"' + ele.getAttribute("name").toString() + '":"' + ele.value.toString() + '",';
    }
  }

  return JSON.parse(data.substr(0, data.length-1) + "}");
}


mainLib.dataBinder.bindServerDataOnTemplate = function(url, model, parent, request_params, execute){
  mainLib.wait.start();
  var received = {};
  request_params = request_params||"";
  if(execute === false){
    return
  }

  mainLib.server.get(url, request_params,
    function(data){
      received = JSON.parse(data);
        mainLib.dataBinder.bindOnTemplate(model, received, parent);
        mainLib.dataBinder.fillLookup('[data-replicated-model="'+model+'"] [data-lookup-url]')
        mainLib.wait.stop();
      },
      function(data){
        mainLib.wait.stop();
        mainLib.aviso('Ocorreu um erro ao obter os dados necessários.' + data);
      }
  )
}


mainLib.fillLookupWaitting = false;


function lookup(selector){
  mainLib.find(selector).loop(function(){
    mainLib.fillLookupWaitting = true;
    this.removeAttribute('data-filled');
    var url = this.getAttribute('data-lookup-url');
    if(url){
      var master_val;
      var master_field_name;
      var data = "";
      var field_name_value = this.getAttribute('data-lookup-field');
      var field_name_text = this.getAttribute('data-lookup-field2');

      if(this.getAttribute('data-lookup-master')){
        var parent = mainLib.find(this.getAttribute('data-lookup-master')).elements[0];
        master_val = parent.value;
        master_field_name = this.getAttribute('data-lookup-master-field');
        data = master_field_name + '=' + master_val;
        if(!parent.getAttribute('data-lookup-event-setted')){
          parent.addEventListener('change', function(){
            this.setAttribute('data-lookup-event-setted', true);
            this.setAttribute('data-value', this.value);
            lookup(selector);

          }, true)
        };
      };
      var element = this;
      mainLib.server.get(url, data,
        function(data){
          dataJS = JSON.parse(data);
          var html = "<option value=''></option>";
          element.innerHTML = "";
          for(var row in dataJS){
            html += '<option value="' + dataJS[row][field_name_value] + '">' + dataJS[row][field_name_text] + '</option>';
          };
          element.innerHTML += html;
          if(element.getAttribute('data-value')){
            element.value = element.getAttribute('data-value');
          };
          element.setAttribute('data-filled', 'true');
          mainLib.fillLookupWaitting = false;

        },
        function(data){
          mainLib.fillLookupWaitting = false;
          document.write(data);
          document.close();
        },
        false
      );
    };
  });
}

mainLib.dataBinder.fillLookup = function(selector){
   lookup(selector);
}

mainLib.dataBinder.autoComplete = function(){
  mainLib.find('.autocomplete input[data-autocomplete-url]').loop(function(){
    this.addEventListener('click', function(e){
      e.stopPropagation();
    });


    var field = this.getAttribute('data-field');
    var img_field = this.getAttribute('data-field-img');
    var img_relative_url = this.getAttribute('data-relative-img-url') || "";
    var text_field = this.getAttribute('data-field-text');
    var url = this.getAttribute('data-autocomplete-url');
    var parent = this.parentElement;
    var search = this;

    var event = document.createEvent('Event');
    event.initEvent('choose', true, true);


    if(url && field && text_field){

      var container = document.createElement('div');
      container.setAttribute('class', 'autocomplete-container stay-on-top suspend hidde');
      container = parent.appendChild(container);

      this.addEventListener('keyup', function(e){
        var esc = 27;
        if (e.keyCode === esc){
          this.parentElement.querySelector('.autocomplete-container').innerHTML = "";
          e.stopPropagation();
          return false;
        };

        this.setAttribute('data-value', "");
        this.setAttribute('data-text', "");
        if(this.value==""){
          container.innerHTML = "";
          return;
        };
        mainLib.server.get(url, text_field  + '=' + this.value, function(data){
          data = JSON.parse(data);
          var html = '<ul>';
          for(row in data){
            if(data.hasOwnProperty(row)){
              if(img_field){
                html += mainLib.format('<li data-value="%s" data-text="%s"> <img src="%s%s" /> %s </li>',
                   [data[row][field], data[row][text_field],  img_relative_url, data[row][img_field], data[row][text_field] ]);
              }else{
                html += mainLib.format('<li data-value="%s" data-text="%s"> %s </li>', [ data[row][text_field],
                  data[row][field], data[row][text_field] ]);
              };
            };
          };
          html += '</ul>';
          if(data.length > 0){
            mainLib.removeClass('hidde', container)
          }else{
            mainLib.addClass('hidde', container);
          };
          container.innerHTML = html;
          mainLib.find('ul li', container).loop(function(){
            this.addEventListener('click', function(){
              search.setAttribute('data-value', this.getAttribute('data-value'));
              search.value = this.getAttribute('data-text');
              search.dispatchEvent(event);
              container.innerHTML = "";
            });
          });
        });
      });
    };

  });

  window.addEventListener('load', function(){

    document.addEventListener('click', function(){
      mainLib.find('.autocomplete-container').loop(function(){
        this.innerHTML = "";
      });
    })
  })
}

mainLib.dataBinder.parseFormElements = function(parentSelector, listElements){
  var frm = mainLib.find(parentSelector).first();
  var data = "";
  for(var i = 0; i < frm.length; i++){
    var ele = frm[i];
    if(listElements.includes(ele.getAttribute('name'))){
      if(ele.type === "checkbox"){
        data += ele.getAttribute("name").toString() + "=" + ele.checked + "&";
      }else{
        data += ele.getAttribute("name").toString() + "=" + ele.value.toString() + "&";
      }
    }
  }
  return data.substr(0, data.length-1);
}

mainLib.dataBinder.bindValidations = function(selector, object_erros){
   mainLib.find(selector).loop(function(){
      if(typeof object_erros != 'object'){
         object_erros = JSON.parse(object_erros);
      };
      var ele = undefined;
      this.find('.errorlist').loop(function(){
        this.parentNode.removeChild(this);
      });

      for(key in object_erros){
         error_ele = document.createElement('div');
         error_ele.setAttribute('class', 'errorlist');

         for(var i = 0; i < object_erros[key].length; i++){
           error_ele.innerHTML += '<p>'+object_erros[key][i]+'</p>'
         };
         ele = mainLib.find('[name="'+key+'"', this).elements[0];
         if(!ele){
           ele = mainLib.find('[name="'+key+'_id"', this).elements[0];
         };
         if(ele){
           ele.parentNode.insertBefore(error_ele, ele);
         }else{
           this.appendChild(error_ele);
         }
      }
   });

}
