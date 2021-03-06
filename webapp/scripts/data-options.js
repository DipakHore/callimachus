// data-options.js
/*
   Portions Copyright (c) 2009-10 Zepheira LLC, Some Rights Reserved
   Portions Copyright (c) 2010-11 Talis Inc, Some Rights Reserved
   Licensed under the Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0
*/

(function($, jQuery){

$(document).ready(function () {
    loadOptions($("[data-options]"));
});

$(document).bind('DOMNodeInserted', function (event) {
    loadOptions($(event.target).find("[data-options]").addBack().filter("[data-options]"));
});

function loadOptions(selects) {
    selects.each(function() {
        var select = $(this);
        var url = select.attr("data-options");
        select.removeAttr("data-options");
        calli.getText(url, function(data) {
            var options = $(data);
            var selected = select.children('option,label');
            var selectedOptions = [];
            options.contents().each(function() {
                if (this.nodeType == 3) {
                    select.append(this); // text node
                } else if (this.nodeType == 1 && $(this).is('option,label')) {
                    var option = $(this);
                    var checked = filterByAttributes(selected, option);
                    var bool = checked.is('option,label:has(input)');
                    if (!bool) { // IE8 can only read :checked if in document
                        disableRDFa(option);
                        option.removeAttr("selected");
                        option.children('input').removeAttr("checked");
                    }
                    checked.remove();
                    select.append(option);
                    if (bool && option.is('option')) {
                        selectedOptions.push(this);
                    }
                }
            });
            $(selectedOptions).each(function() {
                this.selected = true;
            });
            select.find('input[type="radio"]').each(function() {
                this.checked = this.getAttribute('checked') != null;
            });
            var controls = select.parents().addBack().filter('select').add(select.find('input'));
            controls.change(function() {
                select.children("option,label").each(function(){
                    var option = $(this);
                    if (option.is('option:selected') || option.children('input:checked').length) {
                        enableRDFa(option);
                    } else {
                        disableRDFa(option);
                    }
                });
            });
            controls.change();
        }).then(undefined, calli.error);
    });
}

function filterByAttributes(set, node) {
    return set.filter(function() {
        return 0 == countDifferentAttributes($(this), node);
    });
}

var RDFATTR = ["about", "typeof", "rel", "rev", "resource", "property", "href", "src"];

function countDifferentAttributes(selected, option) {
    var count = 0;
    for (var i = 0; i < RDFATTR.length; i++) {
        if (selected.attr(RDFATTR[i]) != option.attr(RDFATTR[i])) {
            count++;
        }
    }
    return count;
}

function disableRDFa(element) {
    element.find('*').addBack().each(function() {
        var node = $(this);
        for (var i = 0; i < RDFATTR.length; i++) {
            disableAttribute(node, RDFATTR[i]);
        }
    });
}

function enableRDFa(element) {
    element.find('*').addBack().each(function() {
        var node = $(this);
        for (var i = 0; i < RDFATTR.length; i++) {
            enableAttribute(node, RDFATTR[i]);
        }
    });
}

function disableAttribute(node, attr) {
    if (node.attr(attr) != undefined) {
        node.attr('data-' + attr, node.attr(attr));
        node.removeAttr(attr);
    }
}

function enableAttribute(node, attr) {
    if (node.attr('data-' + attr) != undefined) {
        node.attr(attr, node.attr('data-' + attr));
        node.removeAttr('data-' + attr);
    }
}

})(jQuery, jQuery);

