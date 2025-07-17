function loadTests(dataTests, callback) {

    "use strict";

    const parentNode = document.querySelector('.test-selection');

    if (dataTests && dataTests.length > 0) {

        for (const node of dataTests) {

            _loadTest.call(parentNode, node);
        }

        parentNode.addEventListener('click', callback);
    }
}
function _loadTest(child) {

    "use strict";

    let {id, name} = child;

    let parentChildNode = document.createElement('div');
    parentChildNode.classList.add('select-wrapper');
    parentChildNode.dataset.nodeType = 'test';
    parentChildNode.dataset.nodeIndex = `${id}`;

    let testName = document.createElement('p');
    testName.classList.add("text-size-small", "font-600", "transition-color-300");
    testName.textContent = name;

    let testButton = document.createElement('a');
    testButton.classList.add("arrow-button");
    testButton.href = `test${id}.html`;
    testButton.role = 'button';
    testButton.dataset.nodeType = 'test-button';
    testButton.dataset.nodeData = `${id}`;

    let img = document.createElement('img');
    img.classList.add('svg');
    img.src = './dist/assets/img/arrow-right-thin.svg';
    img.loading = 'lazy';
    img.alt = "";

    testButton.appendChild(img);

    parentChildNode.appendChild(testName);
    parentChildNode.appendChild(testButton);

    this.appendChild(parentChildNode);
}