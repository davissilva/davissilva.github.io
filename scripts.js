var url = 'https://api.spotify.com';
var token = 'BQA0o79Ud_pnoWfhucVpd9g3QOeKupzLhGHdMJ02pPCQbsPgEkMMcx4AH3idOKwTQdRNTQGSH45qgBSAOpsxWn_iDdYKPhfGmscMBoNSWdbeMZBVYxQ6jA427dKgDk78c83EsGyRdCuk4CDMnBsxDdbO4yGo69QI8fMUhzLcxf2YKWuVa1d6NEsy8hOQNjwxYZZ_ZcAe_KiqDFydlXEF8qSvfFBoWDfaVPvAybTA4lLw75wbHGHJtSNjAPNf9LXcdTE6SjHPUCyX5uHAy9sV_oeJ5-_u-PPAepmSP8vUfAgYwapU_CykVYY6n-rGE7CZQQ';

function exibirItemLista(id, nome) {
  return "<button type='button' class='list-group-item' data-artist='" + id + "'>" + nome + "</button>";
}

function exibirItemAlbum(id, nome) {
  return "<button type='button' class='list-group-item list-group-item-album' data-album='" + id + "'>" + nome + "</button>";
}

function exibirItemMusica(id, nome, preview) {
  return "<a href="+ preview +" target='_blank' class='list-group-item'>" + nome + "</a>";
}

function addLista(id, nome){
  $("#result").append(exibirItemLista(id, nome));
}

function addAlbum(id, nome){
  $("#result-album").append(exibirItemAlbum(id, nome));
}

function addMusica(id, nome, preview){
  $("#result-musics").append(exibirItemMusica(id, nome, preview));
}

function executaConsulta(query) {
  var link = "https://api.spotify.com/v1/search?q="+ query + "&type=artist";

  $.ajax({
    url: link,
    type:'GET',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Authorization': "Bearer " + token
    },
    success: function(response) {
      var dados = response;

      for (i = 0; i < dados.artists.items.length; i++) {
        addLista(dados.artists.items[i].id, dados.artists.items[i].name);
      }

      $(".list-group-item").on('click', function() {
        var id = $(this).data('artist');
        executaAlbum(id);
        $('#result-album').append("<h4>Albums<h4>");
      });
    },
    error: function(error) {
      alert("Erro ao obter dados da API!");
    }
  });
}

function executaAlbum(id) {
  var link = "https://api.spotify.com/v1/artists/"+ id +"/albums";

  $.ajax({
    url: link,
    type:'GET',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Authorization': "Bearer " + token
    },
    success: function(response) {
      var dados = response;

      for (i = 0; i < dados.items.length; i++) {
        addAlbum(dados.items[i].id, dados.items[i].name);
      }

      $(".list-group-item-album").on('click', function() {
        var id = $(this).data('album');
        executaMusicas(id);
        $('#result-musics').append("<h4>Músicas<h4>");
      });
    },
    error: function() {
      alert("Erro ao obter dados da API!");
    }
  });
}

function executaMusicas(idAlbum) {
  var link = "https://api.spotify.com/v1/albums/"+ idAlbum +"/tracks";

  $.ajax({
    url: link,
    type:'GET',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Authorization': "Bearer " + token
    },
    success: function(response) {
      var dados = response;

      for (i = 0; i < dados.items.length; i++) {
        addMusica(dados.items[i].id, dados.items[i].name, dados.items[i].preview_url);
      }
    },
    error: function() {
      alert("Erro ao obter dados da API!");
    }
  });
}

$(function() {
  $("#search").on('click', function() {
    var query = $("#query").val();

    $('#result').empty();
    $('#result-album').empty();
    $('#result-musics').empty();

    executaConsulta(query);
  });
});
