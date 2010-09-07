/*
   Copyright 2009 Zepheira LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */
package org.callimachusproject.rdfa.impl;

import org.callimachusproject.rdfa.model.Reference;

/**
 * A relative IRI.
 * 
 * @author James Leigh
 *
 */
public class ReferenceImpl extends Reference {
	private String absolute;
	private String relative;

	public ReferenceImpl(String absolute, String relative) {
		assert absolute != null;
		assert relative != null;
		this.absolute = absolute;
		this.relative = relative;
	}

	@Override
	public String stringValue() {
		return absolute;
	}

	public String getRelative() {
		return relative;
	}

}
