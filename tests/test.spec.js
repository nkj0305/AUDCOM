describe('Filters', function(){ //describe your object type

    // load module
    beforeEach(function() {
      module('ProfileApp');
    });

    describe('reverse',function(){ //describe your app name
        var reverse;
        beforeEach(inject(function($filter){ /*global inject*///initialize your filter
            reverse = $filter('reverse',{});
        }));
        // var reverse = function(string){return string.split("").reverse().join("");};

        it('Should reverse a string', function(){  //write tests
            expect(5).toBe(5);

            expect(reverse('rahil')).toBe('lihar');  /*global expect*/ //pass
            expect(reverse('don')).toBe('nod'); /*global expect*/ //pass
            //expect(reverse('jam')).toBe('oops'); // this test should fail
        });
    });
});

