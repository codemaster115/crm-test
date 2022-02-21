$(document).ready(() => {
    const characters = document.getElementById('characters');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    let page = 1;
    let items = [];
    let deletedItems = [];
    
    applyFilter(`https://rickandmortyapi.com/api/character/`);
    
    function applyFilter(url) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                    items = data.results;
                    drawItems();
                })
            .catch(error => {
                console.log('error', error);
            })
    }

    function drawItems() {
        if (items && items.length > 0) {
            next.removeAttribute('disabled')
            prev.removeAttribute('disabled');
            characters.innerHTML = items.filter(item => !deletedItems.includes(String(item.id))).map(item => `
                <div class = 'character'>
                    <img src = '${item.image}' />
                    <div class = 'character-info' data-characterID = '${item.id}'>
                        <p>${item.name}</p>
                        <button class="delete" id='${item.id}'>
                            Delete
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            characters.innerHTML = '';
            next.setAttribute('disabled', true);
            prev.setAttribute('disabled', true);
        }
    }

    $("#tbSearch").on('change keyup paste', function () {
        var searchString = $("#tbSearch").val();
        applyFilter(`https://rickandmortyapi.com/api/character/?page=${page}&name=${encodeURIComponent(searchString)}`)
    });

    
    // Remove character by id
    const removeCharacterById = characterId => {
        deletedItems.push(characterId)
        drawItems();
    }
    
    // Show single character
    characters.addEventListener('click', e => {
        const characterInfo = e.path.find(item => {
            if (item.classList) {
                return item.classList.contains('delete');
            }
        });
        if (characterInfo) {
            const characterId = characterInfo.getAttribute('id');
            removeCharacterById(characterId);
        }
    });
    
    // Next clicking
    next.addEventListener('click', () => {
        var searchString = $("#tbSearch").val();
        applyFilter(`https://rickandmortyapi.com/api/character/?page=${++page}&name=${encodeURIComponent(searchString)}`)
    });
    // Prev clicking
     prev.addEventListener('click', () => {
        var searchString = $("#tbSearch").val();
        if (page > 1) {
            applyFilter(`https://rickandmortyapi.com/api/character/?page=${--page}&name=${encodeURIComponent(searchString)}`)
        }
    });

});
