var app = new Vue({
    el: '#app',
    data: {
        title: 'Layout to code',
        input: '',
        output: '',
        visibiltyMod: 'private',
        final: true,
        prefix: '',
        postfix: 'View'
    },
    methods: {
        run: function (event) {
            this.output = ''
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(this.input, "text/xml");

            var views = findViews(xmlDoc.documentElement)
            var visMod = this.visibiltyMod + ' '
            var final = ''
            if (this.final) {
                final = 'final '
            }
            var prefix = this.prefix
            var postfix = this.postfix
            for (var i = 0; i < views.length; i++) {
                this.output += '\n    ' + visMod + final + views[i].type + ' ' + prefix + snakeToCamel(views[i].id) + postfix
            }
            this.output += '\n\n    protected void onBindViews(View view) {'
            for (var i = 0; i < views.length; i++) {
                this.output += '\n        ' + prefix + snakeToCamel(views[i].id) + postfix
                this.output += ' = view.findViewById(R.id.' + views[i].id + ')'
            }
            this.output += '\n    }'
        }
    }
})

function findViews(element) {
    var views = []
    if (element.tagName != 'parsererror') {
        console.log('==============')
        console.log("element -> " + element)
        console.log("element -> " + element.tagName)
        console.log("element -> " + element.children.length)
        if (element.hasAttribute('android:id')) {
            var type = element.tagName
            if (type.includes('.')) {
                type = type.split('.').slice(-1)[0]
            }
            var id = element.getAttribute('android:id').replace('@+id/', '')
            views.push(
                {
                    type: type,
                    id: id
                }
            )
        }
        for (var i = 0; i < element.children.length; i++) {
            views = views.concat(findViews(element.children[i]))
        }
    }

    return views
}

function snakeToCamel(s){
    return s.replace(/_\w/g, (m) => m[1].toUpperCase() );
}