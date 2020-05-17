function App(){
    var that = this
        , template
    ;


    search = {
        findedWordsInfo: {} // info ile jakich słów jest do zmiany
        , wordsToReplace: [] // oryginalne słowa które trzeba zamienić 1:1
        , replaceWordUpperLower: function(word, replaceToText){
            if(!replaceToText) return replaceToText;

            if(word[0] == word[0].toUpperCase()){
                return replaceToText[0].toUpperCase() + replaceToText.substr(1);
            }else{
                return replaceToText;
            }
        }
        , replaceWords: function(){
            var replaceToText = template.$replaceWords.val()
                , replaceToTextTmp = null
                , wordsToReplaceWithoutUnchecked = []
                , orgText, orgTextWordsArr = null, newTextWordsArr = []
                , repleaced = 0
            ;

            template.$findedWords.find('button').each(function(){
                if($(this).find('.checkedStatus').hasClass('isChecked')) wordsToReplaceWithoutUnchecked.push($(this).data('text'));
            });

            if(wordsToReplaceWithoutUnchecked.length <= 0){
                alert('Wyszukaj i zaznacz jakieś słowa!');
                return;
            }

            orgText = template.$inputText.val()
            orgTextWordsArr = orgText.split(" ");
            for (var i = 0; i < orgTextWordsArr.length; i += 1) {
                var word = $.trim(orgTextWordsArr[i]);
                if(word === '') continue;
                if(wordsToReplaceWithoutUnchecked.indexOf(word) >= 0){
                    replaceToTextTmp = search.replaceWordUpperLower(word, replaceToText)
                    newTextWordsArr.push(replaceToTextTmp);
                    repleaced++;
                }else{
                    newTextWordsArr.push(word);
                }
            }

            template.$outputText.val(newTextWordsArr.join(' '));
            alert('Zmieniono '+repleaced)
        }
        , createButtons: function(){
            var replaceToText = template.$replaceWords.val(), replaceToTextTmp;

            template.$findedWords.html('');

            for(var word in search.findedWordsInfo){
                replaceToTextTmp = search.replaceWordUpperLower(word, replaceToText);

                template.$findedWords.append('<button class="btn btn-primary mb-2" data-text="'+word+'"> <i class="far fa-check-square checkedStatus isChecked"></i> '+word+' > "'+replaceToTextTmp+'" <span class="badge badge-light">'+(search.findedWordsInfo[word].count)+'</span></button> ');
            }
            template.$findedWords.append('<br /><br />');
        }
        , printInfo: function(allWordsCount, findedWordsCount){

            template.$findedWordsInfo.html('');
            // template.$findedWords.html('');
            template.$outputText.html('');

            template.$findedWordsInfo.append('Znaleziono: <span> słowa: <strong>'+allWordsCount+'</strong></span>');
            if(allWordsCount <= 0) return;
            
            template.$findedWordsInfo.append('<span>, pasujące: <strong>'+findedWordsCount+'</strong>.</span><br>');

            search.createButtons();
            // if(findedWordsCount > 0){
            //     for(var word in search.findedWordsInfo){
            //         replaceToTextTmp = search.replaceWordUpperLower(word, replaceToText);

            //         template.$findedWords.append('<button class="btn btn-primary mb-2" data-text="'+word+'"> <i class="far fa-check-square checkedStatus isChecked"></i> '+word+' > "'+replaceToTextTmp+'" <span class="badge badge-light">'+(search.findedWordsInfo[word].count)+'</span></button> ');
            //     }
            //     template.$findedWords.append('<br /><br />');
            // }

            template.$findedWords.on('click', 'button', function(e){
                e.preventDefault();
                e.stopPropagation();
                console.log('btn click')
                var $btn = $(this)
                    , $chbk = $btn.find('.checkedStatus')
                ;

                if($chbk.hasClass('isChecked')){
                    $chbk.removeClass('isChecked');
                    $chbk.removeClass('fa-check-square');
                    $chbk.addClass('fa-square');
                    $btn.removeClass('btn-primary');
                    $btn.addClass('btn-secondary');
                }else{
                    $chbk.addClass('isChecked');
                    $chbk.addClass('fa-check-square');
                    $chbk.removeClass('fa-square');
                    $btn.addClass('btn-primary');
                    $btn.removeClass('btn-secondary');
                }
            });
        }
        , analyzeWord: function(searchedWord, word){
            // jeżeli są takie same - to ok
            if(searchedWord === word) return true;
            // jeżeli nie ma jakiegoś z pól to nie ma sensu analizować
            if(!searchedWord || !word) return false;
            // jeżeli słowa zaczynają się na taką samą literę ale wielką
            if(searchedWord === ((word[0]).toLowerCase() + word.substr(1))) return true;

            if(searchedWord[searchedWord.length -1] === '*' || template.$useRegexpBtn.hasClass('isActive')){
                // lore* === loremipsum, lore* === lorem itp.
                if(searchedWord.substr(0, searchedWord.length - 1, -1) === word.substr(0, searchedWord.length - 1, -1)) return true;
                // lore* === Loremipsum, lore* === Lorem itp.
                if(searchedWord.substr(0, searchedWord.length - 1, -1) === ((word[0]).toLowerCase() + word.substr(1)).substr(0, searchedWord.length - 1, -1)) return true;
            }

            return false
        }
        , findWords: function(){
            var orgText = template.$inputText.val()
                , orgTextWordsArr = null
                , searchedWord = $.trim(template.$searchWords.val())
                , findedWordsCount = 0
            ;

            search.findedWordsInfo = {}

            if(!searchedWord) return search.printInfo(0);

            orgTextWordsArr = orgText.split(" ");
            // var answer = "";
            // console.log('słowa: ' + orgTextWordsArr.length)
            for (var i = 0; i < orgTextWordsArr.length; i += 1) {
                var word = $.trim(orgTextWordsArr[i]);
                if(word === '') continue;
                
                if(search.analyzeWord(searchedWord, word)){
                    findedWordsCount++;
                    if(search.findedWordsInfo[word]){
                        search.findedWordsInfo[word].count++;
                    }else{
                        search.findedWordsInfo[word] = {count: 1, word: word};
                    }
                }
            }

            search.printInfo(orgTextWordsArr.length, findedWordsCount);
        
        }
    }

    template = {
        $searchWordsBtn: null
        , $searchWords: null
        , $replaceWordsBtn: null
        , $replaceWords: null
        , $findedWords: null
        , $findedWordsInfo: null
        , $inputText: null
        , $outputText: null
        , $useRegexpBtn: null
        , init: function(){
            template.$searchWordsBtn = $('#searchWordsBtn');
            template.$searchWords = $('#searchWords');
            template.$replaceWordsBtn = $('#replaceWordsBtn');
            template.$replaceWords = $('#replaceWords');
            template.$findedWords = $('#findedWords');
            template.$findedWordsInfo = $('#findedWordsInfo');
            template.$inputText = $('#inputText');
            template.$outputText = $('#outputText');
            template.$useRegexpBtn = $('#useRegexpBtn');

            template.$searchWordsBtn.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                search.findWords();
            });
            template.$searchWords.on('input', function(e){
                template.$outputText.html('');
                search.findWords();
            });
            template.$inputText.on('input', function(e){
                template.$outputText.html('');
                search.findWords();
            });
            
            template.$replaceWordsBtn.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                search.replaceWords();
            });

            template.$replaceWords.on('input', function(e){
                search.createButtons();
            });

            template.$useRegexpBtn.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                var $btn = $(this);
                $btn.toggleClass('isActive');
                if($btn.hasClass('isActive')){
                    $btn.css('opacity', 1);
                }else{
                    $btn.css('opacity', .3);
                }
                
                search.findWords();
            });

            template.$outputText.on('click', function(){
                template.$outputText.select();
                document.execCommand('copy');

                setTimeout(function(){
                    template.$outputText.popover('hide');
                }, 1000);
                template.$outputText.popover('show');
            });

        }
    };

    that.init = function(){
        template.init();
    };
}

$(function(){
    app = new App();
    app.init();
});