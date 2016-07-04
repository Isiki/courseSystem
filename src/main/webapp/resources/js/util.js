/**
 * Created by tuomao on 2016/5/1.
 */
/**可以以post的方法打开新的链接
 * eg:open('POST', 'fileServer.jsp', {request: {key:"42", cols:[2, 3, 34]}});
 * @param verb
 * @param url
 * @param data
 * @param target
 */
function openUrlUtil(verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_self";
    if (data) {
        for (var key in data) {
            var input = document.createElement("textarea");
            input.name = key;
            input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
            form.appendChild(input);
        }
    }
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
}
