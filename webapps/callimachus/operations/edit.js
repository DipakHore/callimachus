/*
   Copyright (c) 2009-2010 Zepheira LLC, Some Rights Reserved
   Licensed under the Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0
*/

(function($){

$(document).ready(initForms);

function initForms() {
	$("form[about]").each(function(i, node) {
		var form = $(node)
		var stored = readRDF(form)
		form.bind("calli:form", function() {
			form.validate({submitHandler: function() {
				submitRDFForm(form, stored)
			}})
		})
	})
}

function submitRDFForm(form, stored) {
	form.triggerHandler("calli:submit")
	try {
		var revised = readRDF(form)
		var removed = stored.except(revised)
		var added = revised.except(stored)
		removed.triples().each(function(){
			addBoundedDescription(this, stored, removed, added)
		})
		added.triples().each(function(){
			addBoundedDescription(this, revised, added, removed)
		})
		var boundary = "jeseditor-boundary"
		var type = "multipart/related;boundary=" + boundary + ";type=\"application/rdf+xml\""
		var data = "--" + boundary + "\r\n" + "Content-Type: application/rdf+xml\r\n\r\n"
				+ removed.dump({format:"application/rdf+xml",serialize:true})
				+ "\r\n--" + boundary + "\r\n" + "Content-Type: application/rdf+xml\r\n\r\n"
				+ added.dump({format:"application/rdf+xml",serialize:true})
				+ "\r\n--" + boundary + "--"
		patchData(form, location.href, type, data, function(data, textStatus, xhr) {
			var uri = location.href
			if (uri.indexOf('?') > 0) {
				uri = uri.substring(0, uri.indexOf('?'))
			}
			form.triggerHandler("calli:redirect")
			var redirect = uri + "?view"
			if (form.attr("data-redirect")) {
				redirect = form.attr("data-redirect")
			}
			location.replace(redirect)
		})
	} catch(e) {
		form.triggerHandler("calli:error", e.description)
	}
	return false
}

function readRDF(form) {
	var subj = $.uri.base()
	if ($(form).attr("about")) {
		subj = subj.resolve($(form).attr("about"))
	}
	var store = form.rdf().databank
	store.triples().each(function(){
		if (this.subject.type == 'uri' && this.subject.value.toString() != subj.toString() && this.subject.value.toString().indexOf(subj.toString() + '#') != 0) {
			store.remove(this)
		} else if (this.subject.type == "bnode") {
			var orphan = true
			$.rdf({databank: store}).where("?s ?p " + this.subject).each(function (i, bindings, triples) {
				orphan = false
			})
			if (orphan) {
				store.remove(this)
			}
		}
	})
	return store
}

function addBoundedDescription(triple, store, dest, copy) {
	if (triple.subject.type == "bnode") {
		var bnode = triple.subject
		$.rdf({databank: store}).where("?s ?p " + bnode).each(function (i, bindings, triples) {
			if (addTriple(triples[0], dest)) {
				copy.add(triples[0])
				addBoundedDescription(triples[0], store, dest, copy)
			}
		})
	}
	if (triple.object.type == "bnode") {
		var bnode = triple.object
		$.rdf({databank: store}).where(bnode + ' ?p ?o').each(function (i, bindings, triples) {
			if (addTriple(triples[0], dest)) {
				copy.add(triples[0])
				addBoundedDescription(triples[0], store, dest, copy)
			}
		})
	}
}

function addTriple(triple, store) {
	var size = store.size()
	store.add(triple)
	return store.size() > size
}

function patchData(form, url, type, data, callback) {
	var xhr = null
	xhr = $.ajax({ type: "POST", url: url, contentType: type, data: data, beforeSend: function(xhr){
		var etag = getEntityTag()
		if (etag) {
			xhr.setRequestHeader("If-Match", etag)
		}
	}, success: function(data, textStatus) {
		form.triggerHandler("calli:ok")
		callback(data, textStatus, xhr)
	}, error: function(xhr, textStatus, errorThrown) {
		form.triggerHandler("calli:error", [xhr.statusText ? xhr.statusText : errorThrown ? errorThrown : textStatus, xhr.responseText])
	}})
}

function getEntityTag() {
	var etag = null
	$("head>meta").each(function(){
		if (this.attributes['http-equiv'].value == 'etag') {
			etag = this.attributes['content'].value
		}
	})
	return etag
}

})(jQuery)

