function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.
let is_hydrating = false;
function start_hydrating() {
    is_hydrating = true;
}
function end_hydrating() {
    is_hydrating = false;
}
function upper_bound(low, high, key, value) {
    // Return first index of value larger than input value in the range [low, high)
    while (low < high) {
        const mid = low + ((high - low) >> 1);
        if (key(mid) <= value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
function init_hydrate(target) {
    if (target.hydrate_init)
        return;
    target.hydrate_init = true;
    // We know that all children have claim_order values since the unclaimed have been detached
    const children = target.childNodes;
    /*
    * Reorder claimed children optimally.
    * We can reorder claimed children optimally by finding the longest subsequence of
    * nodes that are already claimed in order and only moving the rest. The longest
    * subsequence subsequence of nodes that are claimed in order can be found by
    * computing the longest increasing subsequence of .claim_order values.
    *
    * This algorithm is optimal in generating the least amount of reorder operations
    * possible.
    *
    * Proof:
    * We know that, given a set of reordering operations, the nodes that do not move
    * always form an increasing subsequence, since they do not move among each other
    * meaning that they must be already ordered among each other. Thus, the maximal
    * set of nodes that do not move form a longest increasing subsequence.
    */
    // Compute longest increasing subsequence
    // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
    const m = new Int32Array(children.length + 1);
    // Predecessor indices + 1
    const p = new Int32Array(children.length);
    m[0] = -1;
    let longest = 0;
    for (let i = 0; i < children.length; i++) {
        const current = children[i].claim_order;
        // Find the largest subsequence length such that it ends in a value less than our current value
        // upper_bound returns first greater value, so we subtract one
        const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
        p[i] = m[seqLen] + 1;
        const newLen = seqLen + 1;
        // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
        m[newLen] = i;
        longest = Math.max(newLen, longest);
    }
    // The longest increasing subsequence of nodes (initially reversed)
    const lis = [];
    // The rest of the nodes, nodes that will be moved
    const toMove = [];
    let last = children.length - 1;
    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
        lis.push(children[cur - 1]);
        for (; last >= cur; last--) {
            toMove.push(children[last]);
        }
        last--;
    }
    for (; last >= 0; last--) {
        toMove.push(children[last]);
    }
    lis.reverse();
    // We sort the nodes being moved to guarantee that their insertion order matches the claim order
    toMove.sort((a, b) => a.claim_order - b.claim_order);
    // Finally, we move the nodes
    for (let i = 0, j = 0; i < toMove.length; i++) {
        while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
            j++;
        }
        const anchor = j < lis.length ? lis[j] : null;
        target.insertBefore(toMove[i], anchor);
    }
}
function append(target, node) {
    if (is_hydrating) {
        init_hydrate(target);
        if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
            target.actual_end_child = target.firstChild;
        }
        if (node !== target.actual_end_child) {
            target.insertBefore(node, target.actual_end_child);
        }
        else {
            target.actual_end_child = node.nextSibling;
        }
    }
    else if (node.parentNode !== target) {
        target.appendChild(node);
    }
}
function insert(target, node, anchor) {
    if (is_hydrating && !anchor) {
        append(target, node);
    }
    else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
        target.insertBefore(node, anchor || null);
    }
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            start_hydrating();
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        end_hydrating();
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const be = (value, form = 'is') =>  value ? `${form}-${value}` : '';

/* src/elements/button.svelte generated by Svelte v3.38.3 */

function create_fragment$5(ctx) {
	let button;
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			t = text(/*label*/ ctx[3]);
			attr(button, "type", "button");
			attr(button, "class", /*class_list*/ ctx[4]);
			toggle_class(button, "is-light", /*is_light*/ ctx[1]);
			toggle_class(button, "is-outlined", /*is_outlined*/ ctx[2]);
			toggle_class(button, "is-fullwidth", /*is_fullwidth*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[10]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*label*/ 8) set_data(t, /*label*/ ctx[3]);

			if (dirty & /*class_list*/ 16) {
				attr(button, "class", /*class_list*/ ctx[4]);
			}

			if (dirty & /*class_list, is_light*/ 18) {
				toggle_class(button, "is-light", /*is_light*/ ctx[1]);
			}

			if (dirty & /*class_list, is_outlined*/ 20) {
				toggle_class(button, "is-outlined", /*is_outlined*/ ctx[2]);
			}

			if (dirty & /*class_list, is_fullwidth*/ 17) {
				toggle_class(button, "is-fullwidth", /*is_fullwidth*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let color_class;
	let size_class;
	let class_list;
	const dispatch = createEventDispatcher();
	let { color } = $$props;
	let { size = "normal" } = $$props;
	let { is_fullwidth } = $$props;
	let { is_light } = $$props;
	let { is_outlined } = $$props;
	let { label } = $$props;
	const click_handler = () => dispatch("click");

	$$self.$$set = $$props => {
		if ("color" in $$props) $$invalidate(6, color = $$props.color);
		if ("size" in $$props) $$invalidate(7, size = $$props.size);
		if ("is_fullwidth" in $$props) $$invalidate(0, is_fullwidth = $$props.is_fullwidth);
		if ("is_light" in $$props) $$invalidate(1, is_light = $$props.is_light);
		if ("is_outlined" in $$props) $$invalidate(2, is_outlined = $$props.is_outlined);
		if ("label" in $$props) $$invalidate(3, label = $$props.label);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*color*/ 64) {
			$$invalidate(8, color_class = be(color));
		}

		if ($$self.$$.dirty & /*size*/ 128) {
			$$invalidate(9, size_class = be(size));
		}

		if ($$self.$$.dirty & /*color_class, size_class*/ 768) {
			$$invalidate(4, class_list = `button ${color_class} ${size_class}`);
		}
	};

	return [
		is_fullwidth,
		is_light,
		is_outlined,
		label,
		class_list,
		dispatch,
		color,
		size,
		color_class,
		size_class,
		click_handler
	];
}

class Button extends SvelteComponent {
	constructor(options) {
		super();

		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {
			color: 6,
			size: 7,
			is_fullwidth: 0,
			is_light: 1,
			is_outlined: 2,
			label: 3
		});
	}
}

/* src/elements/icon.svelte generated by Svelte v3.38.3 */

function create_fragment$4(ctx) {
	let span;
	let i;

	return {
		c() {
			span = element("span");
			i = element("i");
			attr(i, "class", /*name*/ ctx[0]);
			attr(span, "class", /*class_list*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, i);
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1) {
				attr(i, "class", /*name*/ ctx[0]);
			}

			if (dirty & /*class_list*/ 2) {
				attr(span, "class", /*class_list*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let color_class;
	let class_list;
	let { name } = $$props;
	let { color } = $$props;

	$$self.$$set = $$props => {
		if ("name" in $$props) $$invalidate(0, name = $$props.name);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*color*/ 4) {
			$$invalidate(3, color_class = be(color, "has-text"));
		}

		if ($$self.$$.dirty & /*color_class*/ 8) {
			$$invalidate(1, class_list = `icon ${color_class}`);
		}
	};

	return [name, class_list, color, color_class];
}

class Icon extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, color: 2 });
	}
}

/* src/components/pagination.svelte generated by Svelte v3.38.3 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

// (267:6) {#if allowedPage(page, current)}
function create_if_block_1(ctx) {
	let li;
	let a;
	let t_value = /*page*/ ctx[13] + "";
	let t;
	let a_aria_label_value;
	let a_aria_current_value;
	let mounted;
	let dispose;

	return {
		c() {
			li = element("li");
			a = element("a");
			t = text(t_value);
			attr(a, "class", "pagination-link");

			attr(a, "aria-label", a_aria_label_value = /*current*/ ctx[0] === /*page*/ ctx[13]
			? `Page ${/*page*/ ctx[13]}`
			: `Goto page ${/*page*/ ctx[13]}`);

			attr(a, "aria-current", a_aria_current_value = /*current*/ ctx[0] === /*page*/ ctx[13] ? "page" : null);
			attr(a, "href", "javascript;");
			toggle_class(a, "is-current", /*current*/ ctx[0] === /*page*/ ctx[13]);
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, a);
			append(a, t);

			if (!mounted) {
				dispose = listen(a, "click", prevent_default(function () {
					if (is_function(/*to*/ ctx[6](/*page*/ ctx[13]))) /*to*/ ctx[6](/*page*/ ctx[13]).apply(this, arguments);
				}));

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*pages*/ 4 && t_value !== (t_value = /*page*/ ctx[13] + "")) set_data(t, t_value);

			if (dirty & /*current, pages*/ 5 && a_aria_label_value !== (a_aria_label_value = /*current*/ ctx[0] === /*page*/ ctx[13]
			? `Page ${/*page*/ ctx[13]}`
			: `Goto page ${/*page*/ ctx[13]}`)) {
				attr(a, "aria-label", a_aria_label_value);
			}

			if (dirty & /*current, pages*/ 5 && a_aria_current_value !== (a_aria_current_value = /*current*/ ctx[0] === /*page*/ ctx[13] ? "page" : null)) {
				attr(a, "aria-current", a_aria_current_value);
			}

			if (dirty & /*current, pages*/ 5) {
				toggle_class(a, "is-current", /*current*/ ctx[0] === /*page*/ ctx[13]);
			}
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

// (280:6) {#if showEllipsis(page, current)}
function create_if_block(ctx) {
	let li;

	return {
		c() {
			li = element("li");

			li.innerHTML = `<span class="pagination-ellipsis">…</span> 
        `;
		},
		m(target, anchor) {
			insert(target, li, anchor);
		},
		d(detaching) {
			if (detaching) detach(li);
		}
	};
}

// (266:4) {#each pages as page}
function create_each_block$1(ctx) {
	let show_if_1 = /*allowedPage*/ ctx[7](/*page*/ ctx[13], /*current*/ ctx[0]);
	let t;
	let show_if = /*showEllipsis*/ ctx[8](/*page*/ ctx[13], /*current*/ ctx[0]);
	let if_block1_anchor;
	let if_block0 = show_if_1 && create_if_block_1(ctx);
	let if_block1 = show_if && create_if_block();

	return {
		c() {
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*pages, current*/ 5) show_if_1 = /*allowedPage*/ ctx[7](/*page*/ ctx[13], /*current*/ ctx[0]);

			if (show_if_1) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t.parentNode, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*pages, current*/ 5) show_if = /*showEllipsis*/ ctx[8](/*page*/ ctx[13], /*current*/ ctx[0]);

			if (show_if) {
				if (if_block1) ; else {
					if_block1 = create_if_block();
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

function create_fragment$3(ctx) {
	let nav;
	let a0;
	let t1;
	let a1;
	let t3;
	let ul;
	let mounted;
	let dispose;
	let each_value = /*pages*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			nav = element("nav");
			a0 = element("a");
			a0.textContent = "Previous";
			t1 = space();
			a1 = element("a");
			a1.textContent = "Next";
			t3 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(a0, "class", "pagination-previous");
			attr(a0, "href", "javascript;");
			attr(a1, "class", "pagination-next");
			attr(a1, "href", "javascript;");
			attr(ul, "class", "pagination-list");
			attr(nav, "class", /*class_list*/ ctx[3]);
			attr(nav, "role", "navigation");
			attr(nav, "aria-label", "pagination");
			toggle_class(nav, "is-rounded", /*is_rounded*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, nav, anchor);
			append(nav, a0);
			append(nav, t1);
			append(nav, a1);
			append(nav, t3);
			append(nav, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			if (!mounted) {
				dispose = [
					listen(a0, "click", prevent_default(/*previous*/ ctx[4])),
					listen(a1, "click", prevent_default(/*next*/ ctx[5]))
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*showEllipsis, pages, current, to, allowedPage*/ 453) {
				each_value = /*pages*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*class_list*/ 8) {
				attr(nav, "class", /*class_list*/ ctx[3]);
			}

			if (dirty & /*class_list, is_rounded*/ 10) {
				toggle_class(nav, "is-rounded", /*is_rounded*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(nav);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let pages;
	let size_class;
	let class_list;
	const dispatch = createEventDispatcher();
	let { current = 1 } = $$props;
	let { length = 10 } = $$props;
	let { size } = $$props;
	let { is_rounded = false } = $$props;

	function previous() {
		if (current === 1) return;

		dispatch("previous", {
			from: current,
			to: $$invalidate(0, --current)
		});
	}

	function next() {
		if (current === length) return;

		dispatch("next", {
			from: current,
			to: $$invalidate(0, ++current)
		});
	}

	function to(page) {
		if (current === page) return;
		dispatch("to", { from: current, to: page });
		$$invalidate(0, current = page);
	}

	function allowedPage(page, current) {
		const allowed = new Set([1, length]);
		let pre = 1;
		let post = length;

		if (current < 5) {
			allowed.add(++pre).add(++pre).add(++pre);
		} else if (current > length - 4) {
			allowed.add(--post).add(--post).add(--post);
		} else {
			allowed.add(current).add(current + 1).add(current - 1);
		}

		return allowed.has(page);
	}

	function showEllipsis(page, current) {
		return page === 2 && current > 4 || page === length - 1 && current < length - 3;
	}

	$$self.$$set = $$props => {
		if ("current" in $$props) $$invalidate(0, current = $$props.current);
		if ("length" in $$props) $$invalidate(9, length = $$props.length);
		if ("size" in $$props) $$invalidate(10, size = $$props.size);
		if ("is_rounded" in $$props) $$invalidate(1, is_rounded = $$props.is_rounded);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*length*/ 512) {
			$$invalidate(2, pages = Array.from({ length }, (_, i) => ++i));
		}

		if ($$self.$$.dirty & /*size*/ 1024) {
			$$invalidate(11, size_class = be(size));
		}

		if ($$self.$$.dirty & /*size_class*/ 2048) {
			$$invalidate(3, class_list = `pagination ${size_class}`);
		}
	};

	return [
		current,
		is_rounded,
		pages,
		class_list,
		previous,
		next,
		to,
		allowedPage,
		showEllipsis,
		length,
		size,
		size_class
	];
}

class Pagination extends SvelteComponent {
	constructor(options) {
		super();

		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {
			current: 0,
			length: 9,
			size: 10,
			is_rounded: 1
		});
	}
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function compose$1() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
}

function curry$1(fn) {
  return function curried() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

function isObject$1(value) {
  return {}.toString.call(value).includes('Object');
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function isFunction(value) {
  return typeof value === 'function';
}

function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function validateChanges(initial, changes) {
  if (!isObject$1(changes)) errorHandler$1('changeType');
  if (Object.keys(changes).some(function (field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler$1('changeField');
  return changes;
}

function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler$1('selectorType');
}

function validateHandler(handler) {
  if (!(isFunction(handler) || isObject$1(handler))) errorHandler$1('handlerType');
  if (isObject$1(handler) && Object.values(handler).some(function (_handler) {
    return !isFunction(_handler);
  })) errorHandler$1('handlersType');
}

function validateInitial(initial) {
  if (!initial) errorHandler$1('initialIsRequired');
  if (!isObject$1(initial)) errorHandler$1('initialType');
  if (isEmpty(initial)) errorHandler$1('initialContent');
}

function throwError$1(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages$1 = {
  initialIsRequired: 'initial state is required',
  initialType: 'initial state should be an object',
  initialContent: 'initial state shouldn\'t be an empty object',
  handlerType: 'handler should be an object or a function',
  handlersType: 'all handlers should be a functions',
  selectorType: 'selector should be a function',
  changeType: 'provided value of changes should be an object',
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": 'an unknown error accured in `state-local` package'
};
var errorHandler$1 = curry$1(throwError$1)(errorMessages$1);
var validators$1 = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};

function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  validators$1.initial(initial);
  validators$1.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry$1(didStateUpdate)(state, handler);
  var update = curry$1(updateState)(state);
  var validate = curry$1(validators$1.changes)(initial);
  var getChanges = curry$1(extractChanges)(state);

  function getState() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
      return state;
    };
    validators$1.selector(selector);
    return selector(state.current);
  }

  function setState(causedChanges) {
    compose$1(didUpdate, update, validate, getChanges)(causedChanges);
  }

  return [getState, setState];
}

function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}

function updateState(state, changes) {
  state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
  return changes;
}

function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function (field) {
    var _handler$field;

    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}

var index = {
  create: create
};

var config$1 = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.25.2/min/vs'
  }
};

function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

/**
 * validates the configuration object and informs about deprecation
 * @param {Object} config - the configuration object 
 * @return {Object} config - the validated configuration object
 */

function validateConfig(config) {
  if (!config) errorHandler('configIsRequired');
  if (!isObject(config)) errorHandler('configType');

  if (config.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config.urls.monacoBase
      }
    };
  }

  return config;
}
/**
 * logs deprecation message
 */


function informAboutDeprecation() {
  console.warn(errorMessages.deprecation);
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  configIsRequired: 'the configuration object is required',
  configType: 'the configuration object should be an object',
  "default": 'an unknown error accured in `@monaco-editor/loader` package',
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  config: validateConfig
};

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
};

function merge(target, source) {
  Object.keys(source).forEach(function (key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _objectSpread2$1(_objectSpread2$1({}, target), source);
}

// The source (has been changed) is https://github.com/facebook/react/issues/5465#issuecomment-157888325
var CANCELATION_MESSAGE = {
  type: 'cancelation',
  msg: 'operation is manually canceled'
};

function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function () {
    return hasCanceled_ = true;
  }, wrappedPromise;
}

/** the local state of the module */

var _state$create = index.create({
  config: config$1,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}),
    _state$create2 = _slicedToArray(_state$create, 2),
    getState = _state$create2[0],
    setState = _state$create2[1];
/**
 * set the loader configuration
 * @param {Object} config - the configuration object
 */


function config(config) {
  setState(function (state) {
    return {
      config: merge(state.config, validators.config(config))
    };
  });
}
/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */


function init() {
  var state = getState(function (_ref) {
    var isInitialized = _ref.isInitialized;
    return {
      isInitialized: isInitialized
    };
  });

  if (!state.isInitialized) {
    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      return makeCancelable(Promise.resolve(window.monaco));
    }

    compose(injectScripts, getMonacoLoaderScript)(configureLoader);
    setState({
      isInitialized: true
    });
  }

  return makeCancelable(wrapperPromise);
}
/**
 * injects provided scripts into the document.body
 * @param {Object} script - an HTML script element
 * @return {Object} - the injected HTML script element
 */


function injectScripts(script) {
  return document.body.appendChild(script);
}
/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {Object} - the created HTML script element
 */


function createScript(src) {
  var script = document.createElement('script');
  return src && (script.src = src), script;
}
/**
 * creates an HTML script element with the monaco loader src
 * @return {Object} - the created HTML script element
 */


function getMonacoLoaderScript(configureLoader) {
  var state = getState(function (_ref2) {
    var config = _ref2.config,
        reject = _ref2.reject;
    return {
      config: config,
      reject: reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));

  loaderScript.onload = function () {
    return configureLoader();
  };

  loaderScript.onerror = state.reject;
  return loaderScript;
}
/**
 * configures the monaco loader
 */


function configureLoader() {
  var state = getState(function (_ref3) {
    var config = _ref3.config,
        resolve = _ref3.resolve,
        reject = _ref3.reject;
    return {
      config: config,
      resolve: resolve,
      reject: reject
    };
  });
  var require = window.require;

  require.config(state.config);

  require(['vs/editor/editor.main'], function (monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function (error) {
    state.reject(error);
  });
}
/**
 * store monaco instance in local state
 */


function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco: monaco
    });
  }
}
/**
 * internal helper function
 * extracts stored monaco instance
 * @return {Object|null} - the monaco instance
 */


function __getMonacoInstance() {
  return getState(function (_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}

var wrapperPromise = new Promise(function (resolve, reject) {
  return setState({
    resolve: resolve,
    reject: reject
  });
});
var loader = {
  config: config,
  init: init,
  __getMonacoInstance: __getMonacoInstance
};

/* src/components/editor-code.svelte generated by Svelte v3.38.3 */

function create_fragment$2(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			attr(div, "id", "monaco-container");
			attr(div, "class", "svelte-n8efbp");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { value } = $$props;
	let { theme = "vs-dark" } = $$props;
	let { fontSize = 16 } = $$props;
	let { language = "javascript" } = $$props;
	let editor;
	const dispatch = createEventDispatcher();
	onMount(mountEditor);

	async function mountEditor() {
		const monaco = await loader.init();

		editor = monaco.editor.create(document.getElementById("monaco-container"), {
			theme,
			value,
			language,
			fontSize,
			fontLigatures: true
		});

		editor.onDidChangeModelContent(event => {
			dispatch("change", editor.getValue());
		});
	}

	onDestroy(() => {
		if (editor) editor.dispose();
	});

	$$self.$$set = $$props => {
		if ("value" in $$props) $$invalidate(0, value = $$props.value);
		if ("theme" in $$props) $$invalidate(1, theme = $$props.theme);
		if ("fontSize" in $$props) $$invalidate(2, fontSize = $$props.fontSize);
		if ("language" in $$props) $$invalidate(3, language = $$props.language);
	};

	return [value, theme, fontSize, language];
}

class Editor_code extends SvelteComponent {
	constructor(options) {
		super();

		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {
			value: 0,
			theme: 1,
			fontSize: 2,
			language: 3
		});
	}
}

/* src/form/select.svelte generated by Svelte v3.38.3 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

// (28:4) {#each options as option}
function create_each_block(ctx) {
	let option;
	let t0_value = /*option*/ ctx[11].label + "";
	let t0;
	let t1;
	let option_value_value;

	return {
		c() {
			option = element("option");
			t0 = text(t0_value);
			t1 = space();
			option.__value = option_value_value = /*option*/ ctx[11].value;
			option.value = option.__value;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t0);
			append(option, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*options*/ 1 && t0_value !== (t0_value = /*option*/ ctx[11].label + "")) set_data(t0, t0_value);

			if (dirty & /*options*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[11].value)) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let select;
	let mounted;
	let dispose;
	let each_value = /*options*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(select, "size", /*multiple_size*/ ctx[2]);
			if (/*selected*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[10].call(select));
			attr(div, "class", /*class_list*/ ctx[4]);
			toggle_class(div, "is-multiple", !!/*multiple_size*/ ctx[2]);
			toggle_class(div, "is-rounded", /*is_rounded*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selected*/ ctx[3]);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[10]),
					listen(select, "blur", function () {
						if (is_function(/*dispatch*/ ctx[5]("selected", /*selected*/ ctx[3]))) /*dispatch*/ ctx[5]("selected", /*selected*/ ctx[3]).apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*options*/ 1) {
				each_value = /*options*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*multiple_size*/ 4) {
				attr(select, "size", /*multiple_size*/ ctx[2]);
			}

			if (dirty & /*selected, options*/ 9) {
				select_option(select, /*selected*/ ctx[3]);
			}

			if (dirty & /*class_list*/ 16) {
				attr(div, "class", /*class_list*/ ctx[4]);
			}

			if (dirty & /*class_list, multiple_size*/ 20) {
				toggle_class(div, "is-multiple", !!/*multiple_size*/ ctx[2]);
			}

			if (dirty & /*class_list, is_rounded*/ 18) {
				toggle_class(div, "is-rounded", /*is_rounded*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let color_class;
	let size_class;
	let class_list;
	const dispatch = createEventDispatcher();
	let { options = [] } = $$props;
	let { color } = $$props;
	let { size } = $$props;
	let { is_rounded = false } = $$props;
	let { multiple_size = null } = $$props;
	let selected;

	function select_change_handler() {
		selected = select_value(this);
		$$invalidate(3, selected);
		$$invalidate(0, options);
	}

	$$self.$$set = $$props => {
		if ("options" in $$props) $$invalidate(0, options = $$props.options);
		if ("color" in $$props) $$invalidate(6, color = $$props.color);
		if ("size" in $$props) $$invalidate(7, size = $$props.size);
		if ("is_rounded" in $$props) $$invalidate(1, is_rounded = $$props.is_rounded);
		if ("multiple_size" in $$props) $$invalidate(2, multiple_size = $$props.multiple_size);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*color*/ 64) {
			$$invalidate(8, color_class = be(color));
		}

		if ($$self.$$.dirty & /*size*/ 128) {
			$$invalidate(9, size_class = be(size));
		}

		if ($$self.$$.dirty & /*color_class, size_class*/ 768) {
			$$invalidate(4, class_list = `select ${color_class} ${size_class}`);
		}
	};

	return [
		options,
		is_rounded,
		multiple_size,
		selected,
		class_list,
		dispatch,
		color,
		size,
		color_class,
		size_class,
		select_change_handler
	];
}

class Select extends SvelteComponent {
	constructor(options) {
		super();

		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {
			options: 0,
			color: 6,
			size: 7,
			is_rounded: 1,
			multiple_size: 2
		});
	}
}

/* src/form/input.svelte generated by Svelte v3.38.3 */

function create_fragment(ctx) {
	let input;

	return {
		c() {
			input = element("input");
			attr(input, "class", /*class_list*/ ctx[6]);
			attr(input, "type", /*type*/ ctx[1]);
			attr(input, "placeholder", /*placeholder*/ ctx[2]);
			input.disabled = /*disabled*/ ctx[3];
			input.readOnly = /*readonly*/ ctx[4];
			toggle_class(input, "is-rounded", /*is_rounded*/ ctx[0]);
			toggle_class(input, "is-static", /*is_static*/ ctx[5]);
		},
		m(target, anchor) {
			insert(target, input, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*class_list*/ 64) {
				attr(input, "class", /*class_list*/ ctx[6]);
			}

			if (dirty & /*type*/ 2) {
				attr(input, "type", /*type*/ ctx[1]);
			}

			if (dirty & /*placeholder*/ 4) {
				attr(input, "placeholder", /*placeholder*/ ctx[2]);
			}

			if (dirty & /*disabled*/ 8) {
				input.disabled = /*disabled*/ ctx[3];
			}

			if (dirty & /*readonly*/ 16) {
				input.readOnly = /*readonly*/ ctx[4];
			}

			if (dirty & /*class_list, is_rounded*/ 65) {
				toggle_class(input, "is-rounded", /*is_rounded*/ ctx[0]);
			}

			if (dirty & /*class_list, is_static*/ 96) {
				toggle_class(input, "is-static", /*is_static*/ ctx[5]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let size_class;
	let color_class;
	let class_list;
	let { color } = $$props;
	let { size } = $$props;
	let { is_rounded } = $$props;
	let { type = "text" } = $$props;
	let { placeholder } = $$props;
	let { disabled = false } = $$props;
	let { readonly = false } = $$props;
	let { is_static } = $$props;

	$$self.$$set = $$props => {
		if ("color" in $$props) $$invalidate(7, color = $$props.color);
		if ("size" in $$props) $$invalidate(8, size = $$props.size);
		if ("is_rounded" in $$props) $$invalidate(0, is_rounded = $$props.is_rounded);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
		if ("readonly" in $$props) $$invalidate(4, readonly = $$props.readonly);
		if ("is_static" in $$props) $$invalidate(5, is_static = $$props.is_static);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*size*/ 256) {
			$$invalidate(9, size_class = be(size));
		}

		if ($$self.$$.dirty & /*color*/ 128) {
			$$invalidate(10, color_class = be(color));
		}

		if ($$self.$$.dirty & /*color_class, size_class*/ 1536) {
			$$invalidate(6, class_list = `input ${color_class} ${size_class}`);
		}
	};

	return [
		is_rounded,
		type,
		placeholder,
		disabled,
		readonly,
		is_static,
		class_list,
		color,
		size,
		size_class,
		color_class
	];
}

class Input extends SvelteComponent {
	constructor(options) {
		super();

		init$1(this, options, instance, create_fragment, safe_not_equal, {
			color: 7,
			size: 8,
			is_rounded: 0,
			type: 1,
			placeholder: 2,
			disabled: 3,
			readonly: 4,
			is_static: 5
		});
	}
}

/* src/styles.svelte generated by Svelte v3.38.3 */

class Styles extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, null, null, safe_not_equal, {});
	}
}

export { Button, Editor_code as EditorCode, Icon, Input, Pagination, Select, Styles };
//# sourceMappingURL=index.mjs.map
