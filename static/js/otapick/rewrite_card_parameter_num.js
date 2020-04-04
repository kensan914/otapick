// rewrite card-parameter-num.
function rewrite_card_parameter_num(){
    $(".card-parameter-num").each(function(i, o){
        const card_parameter_num = Number($(o).text());
        if (1000 <= card_parameter_num && card_parameter_num < 10000) {
            var card_parameter_num_min = card_parameter_num/1000;
            card_parameter_num_min = Math.floor(card_parameter_num_min * 10) / 10
            $(this).text(card_parameter_num_min + '千');
        } else if (10000 <= card_parameter_num && card_parameter_num < 100000){
            var card_parameter_num_min = card_parameter_num/10000;
            card_parameter_num_min = Math.floor(card_parameter_num_min * 10) / 10
            $(this).text(card_parameter_num_min + '万');
        } else if (100000 <= card_parameter_num && card_parameter_num < 1000000){
            var card_parameter_num_min = card_parameter_num/10000;
            card_parameter_num_min = Math.floor(card_parameter_num_min)
            $(this).text(card_parameter_num_min + '万');
        } else if (1000000 <= card_parameter_num && card_parameter_num < 10000000){
            var card_parameter_num_min = card_parameter_num/1000000;
            card_parameter_num_min = Math.floor(card_parameter_num_min * 10) / 10
            $(this).text(card_parameter_num_min + 'M');
        } else if (10000000 <= card_parameter_num && card_parameter_num < 100000000){
            var card_parameter_num_min = card_parameter_num/1000000;
            card_parameter_num_min = Math.floor(card_parameter_num_min)
            $(this).text(card_parameter_num_min + 'M');
        } else if (100000000 <= card_parameter_num && card_parameter_num < 1000000000){
            var card_parameter_num_min = card_parameter_num/100000000;
            card_parameter_num_min = Math.floor(card_parameter_num_min * 10) / 10
            $(this).text(card_parameter_num_min + '億');
        } else if (1000000000 <= card_parameter_num && card_parameter_num < 10000000000){
            var card_parameter_num_min = card_parameter_num/100000000;
            card_parameter_num_min = Math.floor(card_parameter_num_min)
            $(this).text(card_parameter_num_min + '億');
        } else if (10000000000 <= card_parameter_num) {
            $(this).text('-');
        }
        $(o).removeClass("card-parameter-num");
    });
}