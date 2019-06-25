ps ax|grep '/opt/audiolog_front/www'|grep node|awk '{print $1}'|xargs kill
